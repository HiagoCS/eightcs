#!/usr/bin/env node

/**
 * Vitrine Digital - Gerenciador de Imagens
 *
 * Execute a partir da raiz do projeto:
 *
 *     npm run images
 *
 * Responsabilidades:
 * - Validar ./config/projetos contra ./config/index.json e o banco SQLite.
 * - Associar pastas de imagens a projetos.
 * - Registrar somente o resultado da operação em config/index.json:
 *       ImagesRegister
 * - Copiar imagens válidas para ./backend/storage/projects/ID_PROJETO/
 * - Formatar ./backend/storage/projects/
 * - Formatar ./config/projetos/
 *
 * Regras importantes:
 * - A associação é salva em project.imageFolder.
 * - Todas as ações entre config e backend são CÓPIAS; os arquivos locais
 *   nunca são movidos ou apagados durante o processamento normal.
 * - A quantidade de imagens da pasta modal/ é comparada SOMENTE com a
 *   quantidade de modais cadastrados no banco para o projeto.
 * - Os números dos nomes das imagens da pasta modal/ servem somente para
 *   ordenação. Eles NÃO são comparados com modal.id.
 * - Um projeto sem modais no banco pode passar sem a pasta modal/.
 * - Um projeto com modais no banco precisa ter exatamente a mesma quantidade
 *   de imagens na pasta modal/ e todas essas imagens precisam começar com
 *   um identificador numérico.
 * - Todo projeto precisa ter pelo menos uma imagem diretamente na raiz da
 *   pasta do projeto.
 */

const fs = require("node:fs");
const path = require("node:path");
const readline = require("node:readline");
const { DatabaseSync } = require("node:sqlite");

const ROOT = process.cwd();

const CONFIG_DIR = path.join(ROOT, "config");
const CONFIG_FILE = path.join(CONFIG_DIR, "index.json");
const PROJECTS_DIR = path.join(CONFIG_DIR, "projetos");
const DATABASE_FILE = path.join(ROOT, "backend", "database.sqlite");
const BACKEND_PROJECTS_DIR = path.join(
    ROOT,
    "backend",
    "storage",
    "projects"
);

const IMAGE_EXTENSIONS = new Set([
    ".avif",
    ".bmp",
    ".gif",
    ".jpeg",
    ".jpg",
    ".png",
    ".svg",
    ".webp"
]);

function normalizeText(value) {
    return String(value ?? "").trim();
}

function normalizeFolderName(value) {
    return normalizeText(value)
        .replace(/^[.\\/]+|[.\\/]+$/g, "")
        .replace(/[\\/]+/g, "");
}

function nowIso() {
    return new Date().toISOString();
}

function getRelative(targetPath) {
    return path
        .relative(ROOT, targetPath)
        .replace(/\\/g, "/");
}

function isImageFile(fileName) {
    return IMAGE_EXTENSIONS.has(
        path.extname(fileName).toLowerCase()
    );
}

function isNumericModalFileName(fileName) {
    const baseName = path.basename(fileName, path.extname(fileName));

    // O identificador numérico fica no início do nome para que a ordenação
    // seja determinística sem depender de modal.id.
    return /^\d+/.test(baseName);
}

function numericPrefix(fileName) {
    const baseName = path.basename(fileName, path.extname(fileName));
    const match = baseName.match(/^\d+/);
    return match ? Number(match[0]) : Number.POSITIVE_INFINITY;
}

function compareModalImages(a, b) {
    const numberA = numericPrefix(a);
    const numberB = numericPrefix(b);

    if (numberA !== numberB) {
        return numberA - numberB;
    }

    return a.localeCompare(b, "pt-BR", {
        numeric: true,
        sensitivity: "base"
    });
}

function loadConfig() {
    if (!fs.existsSync(CONFIG_FILE)) {
        throw new Error(
            "./config/index.json não existe. Execute o setup antes de usar o gerenciador de imagens."
        );
    }

    let config;

    try {
        config = JSON.parse(
            fs.readFileSync(CONFIG_FILE, "utf8")
        );
    } catch (error) {
        throw new Error(
            `./config/index.json existe, mas não contém JSON válido: ${error.message}`
        );
    }

    if (!config || typeof config !== "object") {
        throw new Error(
            "./config/index.json precisa conter um objeto JSON."
        );
    }

    if (!Array.isArray(config.projects)) {
        throw new Error(
            "./config/index.json não contém um array válido em projects."
        );
    }

    return config;
}

function saveConfig(config) {
    fs.writeFileSync(
        CONFIG_FILE,
        `${JSON.stringify(config, null, 4)}\n`,
        "utf8"
    );
}

function ensureProjectsDirectory() {
    // Esta função só deve ser chamada depois da validação inicial, quando
    // ./config/projetos já foi confirmado pelo usuário/programa.
    fs.mkdirSync(PROJECTS_DIR, { recursive: true });
}

function assertInitialEnvironment() {
    if (!fs.existsSync(PROJECTS_DIR)) {
        console.error(
            "\n✗ A pasta ./config/projetos não existe."
        );
        console.error(
            "  Nenhuma operação de imagens será executada."
        );
        process.exitCode = 1;
        return false;
    }

    return true;
}

function assertConfigAvailable() {
    if (!fs.existsSync(CONFIG_FILE)) {
        throw new Error(
            "./config/index.json não existe. Execute o setup antes de usar esta opção."
        );
    }
}

function createReadline() {
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
}

function ask(rl, prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

async function confirm(rl, message) {
    console.log(`\n${message}`);

    while (true) {
        const answer = normalizeText(
            await ask(rl, "\nConfirmar? [S/N]\n> ")
        ).toLowerCase();

        if (answer === "s" || answer === "sim") {
            return true;
        }

        if (
            answer === "n" ||
            answer === "nao" ||
            answer === "não"
        ) {
            return false;
        }

        console.log(
            "Digite S para confirmar ou N para cancelar."
        );
    }
}

async function chooseNumber(rl, prompt, max) {
    while (true) {
        const value = normalizeText(
            await ask(rl, `\n${prompt}\n> `)
        );

        const number = Number(value);

        if (
            Number.isInteger(number) &&
            number >= 1 &&
            number <= max
        ) {
            return number;
        }

        console.log("Opção inválida.");
    }
}

function listProjectFolders() {
    return fs
        .readdirSync(PROJECTS_DIR, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort((a, b) => a.localeCompare(b, "pt-BR", {
            numeric: true,
            sensitivity: "base"
        }));
}

function getProjectName(project) {
    return normalizeText(
        project.name ?? project.title ?? `Projeto ${project.id}`
    );
}

function getProjectId(project, fallbackIndex) {
    const numericId = Number(project.id);

    if (Number.isInteger(numericId) && numericId > 0) {
        return numericId;
    }

    return fallbackIndex + 1;
}

function getProjectAssociation(project) {
    const value = project.imageFolder;

    if (!value) {
        return null;
    }

    return normalizeFolderName(value);
}

function buildAssociationState(config, folders) {
    const folderMap = new Map();
    const duplicateAssociations = [];

    config.projects.forEach((project, index) => {
        const folder = getProjectAssociation(project);

        if (!folder) {
            return;
        }

        if (!folderMap.has(folder)) {
            folderMap.set(folder, []);
        }

        folderMap
            .get(folder)
            .push({
                project,
                index
            });
    });

    for (const [folder, associations] of folderMap.entries()) {
        if (associations.length > 1) {
            duplicateAssociations.push({
                folder,
                projects: associations.map(({ project }) => project)
            });
        }
    }

    const associatedFolders = new Set(
        folderMap.keys()
    );

    const associatedProjectIds = new Map();

    config.projects.forEach((project, index) => {
        associatedProjectIds.set(
            getProjectId(project, index),
            getProjectAssociation(project)
        );
    });

    return {
        folderMap,
        associatedFolders,
        associatedProjectIds,
        duplicateAssociations,
        folders,
        foldersInSystem: folders.filter((folder) =>
            associatedFolders.has(folder)
        ),
        foldersOutsideSystem: folders.filter((folder) =>
            !associatedFolders.has(folder)
        )
    };
}

function printInitialOverview(config, state) {
    console.log(
        "\n════════════════════════════════════════"
    );
    console.log("ASSOCIAÇÃO DE IMAGENS");
    console.log(
        "════════════════════════════════════════"
    );

    console.log("\nPASTAS NO SISTEMA");

    if (!state.foldersInSystem.length) {
        console.log("  (nenhuma)");
    } else {
        state.foldersInSystem.forEach((folder) => {
            const entries = state.folderMap.get(folder) || [];

            entries.forEach(({ project }) => {
                const projectId = getProjectId(
                    project,
                    config.projects.indexOf(project)
                );
                console.log(
                    `  - ${folder}/ (${projectId} - ${getProjectName(project)})`
                );
            });
        });
    }

    console.log("\nPASTAS FORA DO SISTEMA");

    if (!state.foldersOutsideSystem.length) {
        console.log("  (nenhuma)");
    } else {
        state.foldersOutsideSystem.forEach((folder) => {
            console.log(`  - ${folder}/`);
        });
    }

    console.log("\nPROJETOS SEM IMAGENS");

    const withoutImages = findProjectsWithoutImages(
        config,
        state.folders
    );

    if (!withoutImages.length) {
        console.log("  (nenhum)");
    } else {
        withoutImages.forEach((item) => {
            console.log(
                `  - ${item.id} - ${item.name}: ${item.reason}`
            );
        });
    }

    if (state.duplicateAssociations.length) {
        console.log(
            "\n⚠ ASSOCIAÇÕES DUPLICADAS"
        );

        state.duplicateAssociations.forEach(({ folder, projects }) => {
            console.log(`  - ${folder}/`);
            projects.forEach((project) => {
                console.log(
                    `      ${getProjectId(project, config.projects.indexOf(project))} - ${getProjectName(project)}`
                );
            });
        });
    }
}

function findProjectsWithoutImages(config, folders) {
    const folderSet = new Set(folders);
    const result = [];

    config.projects.forEach((project, index) => {
        const association = getProjectAssociation(project);
        const id = getProjectId(project, index);
        const name = getProjectName(project);

        if (!association) {
            result.push({
                id,
                name,
                reason: "sem pasta de imagens associada"
            });
            return;
        }

        if (!folderSet.has(association)) {
            result.push({
                id,
                name,
                reason: `pasta associada não encontrada (${association}/)`
            });
            return;
        }

        const rootImages = getImageFiles(
            path.join(PROJECTS_DIR, association)
        );

        if (!rootImages.length) {
            result.push({
                id,
                name,
                reason: "sem imagem geral na raiz da pasta"
            });
        }
    });

    return result;
}

function printAssociationLists(config, state) {
    console.log(
        "\n════════════════════════════════════════"
    );
    console.log("PASTAS DE IMAGENS");
    console.log(
        "════════════════════════════════════════"
    );

    state.folders.forEach((folder, index) => {
        const entries = state.folderMap.get(folder) || [];

        if (entries.length) {
            const labels = entries.map(({ project }) =>
                `${getProjectId(project, config.projects.indexOf(project))} - ${getProjectName(project)}`
            );

            console.log(
                `[${index + 1}] ${folder}/ (${labels.join(", ")})`
            );
        } else {
            console.log(`[${index + 1}] ${folder}/`);
        }
    });

    console.log(
        "\n════════════════════════════════════════"
    );
    console.log("PROJETOS");
    console.log(
        "════════════════════════════════════════"
    );

    config.projects.forEach((project, index) => {
        const association = getProjectAssociation(project);

        if (association) {
            console.log(
                `[${index + 1}] ${getProjectId(project, index)} - ${getProjectName(project)} (${association}/)`
            );
        } else {
            console.log(
                `[${index + 1}] ${getProjectId(project, index)} - ${getProjectName(project)}`
            );
        }
    });
}

async function associateFolders(rl, config) {
    let changed = false;

    while (true) {
        const folders = listProjectFolders();
        const state = buildAssociationState(config, folders);

        if (!folders.length) {
            console.log(
                "\nNão existem pastas para associar em ./config/projetos."
            );
            return changed;
        }

        printAssociationLists(config, state);

        console.log(
            "\nSelecione a pasta que será associada."
        );
        console.log("[0] Finalizar associações");

        let folderChoice;

        while (true) {
            const value = normalizeText(
                await ask(rl, "> ")
            );

            if (value === "0") {
                return changed;
            }

            const number = Number(value);

            if (
                Number.isInteger(number) &&
                number >= 1 &&
                number <= folders.length
            ) {
                folderChoice = number;
                break;
            }

            console.log("Opção inválida.");
        }

        const selectedFolder = folders[
            folderChoice - 1
        ];

        console.log(
            `\nPasta selecionada: ${selectedFolder}/`
        );

        const projectChoice = await chooseNumber(
            rl,
            "Selecione o projeto que receberá esta pasta:",
            config.projects.length
        );

        const selectedProject = config.projects[
            projectChoice - 1
        ];

        const oldAssociation = getProjectAssociation(
            selectedProject
        );

        const stateAfterSelection = buildAssociationState(
            config,
            folders
        );

        const currentFolderOwner =
            stateAfterSelection.folderMap.get(selectedFolder) || [];

        const conflicts = [];

        if (
            oldAssociation &&
            oldAssociation !== selectedFolder
        ) {
            conflicts.push(
                `o projeto já está associado a ${oldAssociation}/`
            );
        }

        for (const { project } of currentFolderOwner) {
            if (project !== selectedProject) {
                conflicts.push(
                    `a pasta já está associada ao projeto ${getProjectId(project, config.projects.indexOf(project))} - ${getProjectName(project)}`
                );
            }
        }

        if (conflicts.length) {
            console.log("\n⚠ Conflito de associação:");
            conflicts.forEach((message) => {
                console.log(`  - ${message}`);
            });

            const replace = await confirm(
                rl,
                "Deseja substituir as associações conflitantes?"
            );

            if (!replace) {
                console.log("\nAssociação não alterada.");
                continue;
            }

            // Remove a associação da pasta selecionada de qualquer projeto
            // anterior e libera a associação anterior deste projeto.
            config.projects.forEach((project) => {
                const association = getProjectAssociation(project);

                if (
                    association === selectedFolder ||
                    (
                        project === selectedProject &&
                        association === oldAssociation
                    )
                ) {
                    delete project.imageFolder;
                }
            });
        }

        selectedProject.imageFolder = selectedFolder;

        saveConfig(config);
        changed = true;

        console.log(
            `\n✓ Associação salva: ${selectedFolder}/ → ${getProjectId(selectedProject, projectChoice - 1)} - ${getProjectName(selectedProject)}`
        );

        const another = await confirm(
            rl,
            "Deseja associar outra pasta de imagens aos projetos?"
        );

        if (!another) {
            return changed;
        }
    }
}

function openDatabase() {
    if (!fs.existsSync(DATABASE_FILE)) {
        throw new Error(
            "O banco ./backend/database.sqlite não existe. O número de modais precisa ser lido do banco para validar as imagens."
        );
    }

    try {
        return new DatabaseSync(DATABASE_FILE);
    } catch (error) {
        throw new Error(
            `Não foi possível abrir o banco ${getRelative(DATABASE_FILE)}: ${error.message}`
        );
    }
}

function readModalCounts() {
    const database = openDatabase();

    try {
        const tables = database
            .prepare(
                "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'modal'"
            )
            .all();

        if (!tables.length) {
            throw new Error(
                "A tabela modal não existe no banco."
            );
        }

        const rows = database
            .prepare(
                "SELECT project_id, COUNT(*) AS modal_count FROM modal GROUP BY project_id"
            )
            .all();

        const counts = new Map();

        rows.forEach((row) => {
            const projectId = Number(row.project_id);
            const modalCount = Number(row.modal_count);

            if (
                Number.isInteger(projectId) &&
                Number.isInteger(modalCount)
            ) {
                counts.set(projectId, modalCount);
            }
        });

        return counts;
    } finally {
        database.close();
    }
}

function getImageFiles(directory) {
    if (!fs.existsSync(directory)) {
        return [];
    }

    return fs
        .readdirSync(directory, { withFileTypes: true })
        .filter((entry) =>
            entry.isFile() &&
            !entry.name.startsWith(".") &&
            isImageFile(entry.name)
        )
        .map((entry) => entry.name)
        .sort((a, b) => a.localeCompare(b, "pt-BR", {
            numeric: true,
            sensitivity: "base"
        }));
}

function getModalImageFiles(directory) {
    return getImageFiles(directory)
        .sort(compareModalImages);
}

function hasDuplicateAssociation(config, project) {
    const association = getProjectAssociation(project);

    if (!association) {
        return false;
    }

    return config.projects.some((candidate) =>
        candidate !== project &&
        getProjectAssociation(candidate) === association
    );
}

function validateProject(project, index, modalCounts, config) {
    const id = getProjectId(project, index);
    const name = getProjectName(project);
    const association = getProjectAssociation(project);
    const errors = [];

    let generalImages = [];
    let modalImages = [];
    let modalCount = Number(modalCounts.get(id) || 0);

    if (!Number.isInteger(modalCount) || modalCount < 0) {
        modalCount = 0;
    }

    if (!association) {
        errors.push(
            "Nenhuma pasta de imagens está associada ao projeto."
        );
    } else {
        const projectDirectory = path.join(
            PROJECTS_DIR,
            association
        );

        if (!fs.existsSync(projectDirectory)) {
            errors.push(
                `A pasta associada não existe: ./config/projetos/${association}/`
            );
        } else {
            generalImages = getImageFiles(
                projectDirectory
            );

            if (!generalImages.length) {
                errors.push(
                    "O projeto não possui imagem geral diretamente na raiz da pasta."
                );
            }

            if (modalCount > 0) {
                const modalDirectory = path.join(
                    projectDirectory,
                    "modal"
                );

                if (!fs.existsSync(modalDirectory)) {
                    errors.push(
                        `O banco possui ${modalCount} ${modalCount === 1 ? "modal" : "modais"}, mas a pasta /modal/ não existe.`
                    );
                } else {
                    modalImages = getModalImageFiles(
                        modalDirectory
                    );

                    if (modalImages.length !== modalCount) {
                        errors.push(
                            `Quantidade de imagens em /modal/ incompatível com o banco: ${modalCount} ${modalCount === 1 ? "modal" : "modais"} cadastrado${modalCount === 1 ? "" : "s"} e ${modalImages.length} ${modalImages.length === 1 ? "imagem" : "imagens"}.`
                        );
                    }

                    const unnumbered = modalImages.filter(
                        (fileName) =>
                            !isNumericModalFileName(fileName)
                    );

                    if (unnumbered.length) {
                        const paths = unnumbered.map((fileName) =>
                            `./config/projetos/${association}/modal/${fileName}`
                        );

                        errors.push(
                            `Existem imagens em /modal/ sem identificador numérico no início do nome: ${paths.join(", ")}.`
                        );
                    }
                }
            }
        }
    }

    if (hasDuplicateAssociation(config, project)) {
        errors.push(
            `A pasta ${association}/ está associada a mais de um projeto.`
        );
    }

    return {
        id,
        name,
        association,
        status: errors.length === 0,
        errors,
        generalImages,
        modalImages,
        modalCount
    };
}

function validateAllProjects(config, modalCounts) {
    return config.projects.map((project, index) =>
        validateProject(project, index, modalCounts, config)
    );
}

function formatReportImageCount(count) {
    return `${count}`;
}

function printProjectResults(results) {
    console.log(
        "\n════════════════════════════════════════"
    );
    console.log("RESULTADO DOS PROJETOS");
    console.log(
        "════════════════════════════════════════"
    );

    if (!results.length) {
        console.log("  Nenhum projeto cadastrado no config.");
        return;
    }

    results.forEach((result) => {
        const state = result.status ? "OK" : "FALHA";

        console.log(
            `\n${result.id} - ${result.name} / Imagens: ${formatReportImageCount(result.generalImages.length)}; Modais: ${result.modalCount}; Associação de dados com imagens - ${state}`
        );

        if (!result.status) {
            result.errors.forEach((error) => {
                console.log(`  ✗ ${error}`);
            });

            if (result.modalCount > 0) {
                console.log(
                    `  ! O banco registra ${result.modalCount} ${result.modalCount === 1 ? "modal" : "modais"}.`
                );
                console.log(
                    `  ! A pasta de imagens possui ${result.modalImages.length} ${result.modalImages.length === 1 ? "imagem" : "imagens"} na pasta /modal/.`
                );
            }

            console.log(
                "  ! Corrija as imagens e execute novamente o gerenciador."
            );
        }
    });
}

function buildImageRegister(results) {
    return {
        updateAt: nowIso(),
        projectsResults: results.map((result) => {
            const output = {
                id: result.id,
                name: result.name,
                status: Boolean(result.status)
            };

            if (!result.status) {
                output.error_log = result.errors.join(" ");
            }

            return output;
        })
    };
}

function registerResults(config, results) {
    config.ImagesRegister = buildImageRegister(results);
    saveConfig(config);
}

function copyFile(sourcePath, destinationPath) {
    fs.mkdirSync(path.dirname(destinationPath), {
        recursive: true
    });

    fs.copyFileSync(
        sourcePath,
        destinationPath
    );
}

function copyValidatedProject(result) {
    const sourceDirectory = path.join(
        PROJECTS_DIR,
        result.association
    );

    const destinationDirectory = path.join(
        BACKEND_PROJECTS_DIR,
        String(result.id)
    );

    const copied = [];

    for (const fileName of result.generalImages) {
        const source = path.join(
            sourceDirectory,
            fileName
        );
        const destination = path.join(
            destinationDirectory,
            fileName
        );

        copyFile(source, destination);
        copied.push(getRelative(destination));
    }

    if (result.modalCount > 0) {
        const sourceModalDirectory = path.join(
            sourceDirectory,
            "modal"
        );
        const destinationModalDirectory = path.join(
            destinationDirectory,
            "modal"
        );

        for (const fileName of result.modalImages) {
            const source = path.join(
                sourceModalDirectory,
                fileName
            );
            const destination = path.join(
                destinationModalDirectory,
                fileName
            );

            copyFile(source, destination);
            copied.push(getRelative(destination));
        }
    }

    return copied;
}

function copyProjects(results) {
    const finalResults = results.map((result) => ({
        ...result,
        errors: [...result.errors],
        copied: []
    }));

    fs.mkdirSync(BACKEND_PROJECTS_DIR, { recursive: true });

    for (const result of finalResults) {
        if (!result.status) {
            continue;
        }

        try {
            result.copied = copyValidatedProject(result);
        } catch (error) {
            result.status = false;
            result.copied = [];
            result.errors.push(
                `Falha ao copiar as imagens para ./backend/storage/projects/${result.id}/: ${error.message}`
            );
        }
    }

    return finalResults;
}

async function runValidationAndCopy(rl, config) {
    const modalCounts = readModalCounts();
    const results = validateAllProjects(
        config,
        modalCounts
    );

    printProjectResults(results);

    const validResults = results.filter(
        (result) => result.status
    );

    const invalidResults = results.filter(
        (result) => !result.status
    );

    console.log(
        `\nProjetos válidos para cópia: ${validResults.length}`
    );
    console.log(
        `Projetos bloqueados pela validação: ${invalidResults.length}`
    );

    if (!validResults.length) {
        registerResults(config, results);
        console.log(
            "\nNenhum projeto passou pela validação. Nenhuma imagem foi copiada."
        );
        return;
    }

    const confirmed = await confirm(
        rl,
        "Deseja copiar para o backend somente os projetos que passaram na validação?"
    );

    if (!confirmed) {
        console.log(
            "\nCópia cancelada. Nenhuma imagem foi enviada ao backend."
        );
        return;
    }

    const finalResults = copyProjects(results);

    registerResults(
        config,
        finalResults
    );

    console.log(
        "\n════════════════════════════════════════"
    );
    console.log("PROCESSAMENTO FINAL");
    console.log(
        "════════════════════════════════════════"
    );

    finalResults.forEach((result) => {
        if (result.status) {
            console.log(
                `✓ ${result.id} - ${result.name} — ${result.copied.length} imagem(ns) copiada(s).`
            );
            return;
        }

        console.log(
            `✗ ${result.id} - ${result.name} — operação bloqueada/falhou.`
        );
    });

    console.log(
        `\n✓ Log salvo em ${getRelative(CONFIG_FILE)} -> ImagesRegister`
    );
}

async function optionOne(rl, config) {
    let state = buildAssociationState(
        config,
        listProjectFolders()
    );

    printInitialOverview(config, state);

    if (
        state.foldersOutsideSystem.length &&
        findProjectsWithoutImages(config, state.folders).length
    ) {
        const shouldAssociate = await confirm(
            rl,
            "Temos projetos sem imagens, deseja associar alguma pasta de imagens aos projetos?"
        );

        if (shouldAssociate) {
            await associateFolders(rl, config);

            state = buildAssociationState(
                config,
                listProjectFolders()
            );

            console.log(
                "\nASSOCIAÇÕES ATUAIS"
            );

            if (!state.foldersInSystem.length) {
                console.log("  (nenhuma)");
            } else {
                state.foldersInSystem.forEach((folder) => {
                    const entries = state.folderMap.get(folder) || [];
                    entries.forEach(({ project }) => {
                        console.log(
                            `  - ${folder}/ → ${getProjectId(project, config.projects.indexOf(project))} - ${getProjectName(project)}`
                        );
                    });
                });
            }
        }
    }

    await runValidationAndCopy(rl, config);
}

async function optionTwo(rl, config) {
    console.log(
        "\nNenhuma nova associação será feita. O processamento usará somente as associações já salvas."
    );

    const state = buildAssociationState(
        config,
        listProjectFolders()
    );

    console.log("\nASSOCIAÇÕES EXISTENTES");

    if (!state.foldersInSystem.length) {
        console.log("  (nenhuma)");
    } else {
        state.foldersInSystem.forEach((folder) => {
            const entries = state.folderMap.get(folder) || [];
            entries.forEach(({ project }) => {
                console.log(
                    `  - ${folder}/ → ${getProjectId(project, config.projects.indexOf(project))} - ${getProjectName(project)}`
                );
            });
        });
    }

    await runValidationAndCopy(rl, config);
}

function removeDirectoryContents(directory) {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
        return;
    }

    for (const entry of fs.readdirSync(directory)) {
        fs.rmSync(
            path.join(directory, entry),
            {
                recursive: true,
                force: true
            }
        );
    }
}

async function optionThree(rl) {
    const confirmed = await confirm(
        rl,
        "A opção 3 vai limpar completamente ./backend/storage/projects/. Nenhuma outra pasta do backend será alterada."
    );

    if (!confirmed) {
        console.log("\nFormatação cancelada.");
        return;
    }

    removeDirectoryContents(
        BACKEND_PROJECTS_DIR
    );

    console.log(
        `\n✓ ${getRelative(BACKEND_PROJECTS_DIR)}/ foi formatada.`
    );
}

async function optionFour(rl, config) {
    const confirmed = await confirm(
        rl,
        "A opção 4 vai limpar completamente ./config/projetos/ e remover ImagesRegister de ./config/index.json."
    );

    if (!confirmed) {
        console.log("\nFormatação cancelada.");
        return;
    }

    removeDirectoryContents(
        PROJECTS_DIR
    );

    delete config.ImagesRegister;
    saveConfig(config);

    console.log(
        `\n✓ ${getRelative(PROJECTS_DIR)}/ foi formatada.`
    );
    console.log(
        "✓ ImagesRegister removido de ./config/index.json."
    );
}

async function chooseMainOption(rl) {
    console.log(
        "\n════════════════════════════════════════"
    );
    console.log("ASSOCIAÇÃO DE IMAGENS");
    console.log("== Vitrine Digital ==");
    console.log(
        "════════════════════════════════════════"
    );
    console.log("[1] - Associar Imagens aos Dados");
    console.log("[2] - Copiar Imagens ao Backend");
    console.log("[3] - Formatar Backend");
    console.log("[4] - Formatar config local");

    return chooseNumber(
        rl,
        "Selecione uma opção:",
        4
    );
}

async function main() {
    if (!assertInitialEnvironment()) {
        return;
    }

    const rl = createReadline();

    try {
        const option = await chooseMainOption(rl);

        switch (option) {
            case 1: {
                assertConfigAvailable();
                const config = loadConfig();
                await optionOne(rl, config);
                break;
            }

            case 2: {
                assertConfigAvailable();
                const config = loadConfig();
                await optionTwo(rl, config);
                break;
            }

            case 3:
                await optionThree(rl);
                break;

            case 4: {
                assertConfigAvailable();
                const config = loadConfig();
                await optionFour(rl, config);
                break;
            }

            default:
                throw new Error("Opção inválida.");
        }
    } catch (error) {
        console.error(
            `\n✗ ${error.message}`
        );
        process.exitCode = 1;
    } finally {
        rl.close();
    }
}

main();