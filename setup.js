#!/usr/bin/env node

/**
 * Vitrine Digital - Configurador
 *
 * Execute na raiz do projeto:
 *     npm run setup
 *
 * Regras principais de navegação:
 *
 * 1. HomePage é obrigatória.
 *    - A única informação perguntada é a label.
 *    - function = HomePage
 *    - url = /
 *    - type_id = null
 *
 * 2. Outros links:
 *    - label
 *    - URL
 *    - categoria/type_id
 *    - function React por último
 *
 *    Se possuir categoria:
 *        function = nome da categoria + "Page"
 *
 *    Exemplo:
 *        Declarações Fiscais
 *        ->
 *        DeclaracoesFiscaisPage
 *
 *    Se não possuir categoria:
 *        function é perguntada manualmente.
 *
 * 3. ContactPage é opcional e sempre fica por último.
 *    - A única informação perguntada é a label.
 *    - function = ContactPage
 *    - url = /contato
 *    - type_id = null
 *
 * IDs:
 *    Nenhum ID primário é perguntado ao usuário.
 *    O setup gera automaticamente os IDs.
 *
 * Foreign keys continuam sendo escolhidas normalmente:
 *    - typeId
 *    - linkId
 *    - projectId
 */

const fs = require("node:fs");
const path = require("node:path");
const readline = require("node:readline");

const ROOT = process.cwd();

const CONFIG_DIR = path.join(
    ROOT,
    "config"
);

const CONFIG_FILE = path.join(
    CONFIG_DIR,
    "index.json"
);

const PROJECTS_DIR = path.join(
    CONFIG_DIR,
    "projetos"
);

/*
|--------------------------------------------------------------------------
| CONFIGURAÇÃO PADRÃO
|--------------------------------------------------------------------------
*/

const DEFAULT_CONFIG = {
    version: 1,

    system: {
        name: "Vitrine Digital",
        slug: "vitrine-digital"
    },

    company: {
        name: "",
        company: "",
        occupation: "",
        description: "",
        footer: ""
    },

    contacts: {
        email: "",
        phone: "",
        whatsapp: "",
        address: ""
    },

    navigation: [],

    types: [],

    projects: [],

    homeCards: [],

    theme: {
        primary: "#1D1D1D",
        secondary: "#3A3A3A",
        outline: "#666666",
        background: "#DADADA",
        backgroundLight: "#EEEEEE",
        white: "#FFFFFF"
    }
};

/*
|--------------------------------------------------------------------------
| LOCALIZAÇÃO DAS SEEDS
|--------------------------------------------------------------------------
*/

const SEED_CANDIDATES = {
    infos: [
        "backend/src/db/seeds/infosSeed.ts"
    ],

    pages: [
        "backend/src/db/seeds/navbarLinks/pages.ts"
    ],

    types: [
        "backend/src/db/seeds/projects/types.ts"
    ],

    projects: [
        "backend/src/db/seeds/projects/projects.ts"
    ],

    modal: [
        "backend/src/db/seeds/projects/modal.ts"
    ],

    homeCards: [
        "backend/src/db/seeds/navbarLinks/homeCards.ts"
    ]
};

/*
|--------------------------------------------------------------------------
| UTILITÁRIOS
|--------------------------------------------------------------------------
*/

function clone(value) {
    return JSON.parse(
        JSON.stringify(value)
    );
}

function normalizeText(value) {
    return String(
        value ?? ""
    ).trim();
}

function slugify(value) {
    return normalizeText(value)
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toLowerCase()
        .replace(
            /[^a-z0-9]+/g,
            "-"
        )
        .replace(
            /^-+|-+$/g,
            ""
        )
        .replace(
            /-{2,}/g,
            "-"
        );
}
function getHomeCardClass(
    functionName
) {
    return normalizeText(
        functionName
    )
        .replace(
            /Page$/i,
            ""
        )
        .toLowerCase();
}
/*
 * Transforma o nome legível da categoria em um
 * identificador válido para componente React.
 *
 * Exemplo:
 *
 * Declarações Fiscais
 * ->
 * DeclaracoesFiscaisPage
 *
 * Imposto de Renda
 * ->
 * ImpostoDeRendaPage
 */
function componentPageName(value) {
    const parts =
        slugify(value)
            .split("-")
            .filter(Boolean);

    const base =
        parts
            .map(
                (part) =>
                    part.charAt(0).toUpperCase() +
                    part.slice(1)
            )
            .join("-");

    return `${base || "Page"}Page`;
}

function nowIso() {
    return new Date().toISOString();
}

function getRelative(file) {
    return path
        .relative(
            ROOT,
            file
        )
        .replace(
            /\\/g,
            "/"
        );
}

function toJs(value) {
    return JSON.stringify(
        value,
        null,
        8
    ).replace(
        /^( {8})/gm,
        "        "
    );
}

function isPositiveId(value) {
    return (
        Number.isInteger(
            Number(value)
        ) &&
        Number(value) > 0
    );
}

/*
|--------------------------------------------------------------------------
| IDS
|--------------------------------------------------------------------------
*/

/*
 * Mantém o ID existente quando válido.
 *
 * Item novo:
 *     próximo ID após o maior existente.
 */
function nextId(
    items,
    currentId = null
) {
    if (
        isPositiveId(
            currentId
        )
    ) {
        return Number(
            currentId
        );
    }

    const maxId =
        (
            Array.isArray(items)
                ? items
                : []
        ).reduce(
            (
                max,
                item
            ) => {
                const id =
                    Number(
                        item?.id
                    );

                return (
                    Number.isInteger(id) &&
                    id > max
                )
                    ? id
                    : max;
            },
            0
        );

    return maxId + 1;
}

/*
 * Garante IDs únicos dentro de uma coleção.
 *
 * IDs antigos válidos são preservados.
 * IDs inválidos/duplicados recebem novos IDs.
 */
function ensureIds(
    items,
    prefix = "item"
) {
    if (
        !Array.isArray(items)
    ) {
        return [];
    }

    const result = [];
    const seen = new Set();

    let maxId =
        items.reduce(
            (
                max,
                item
            ) => {
                const id =
                    Number(
                        item?.id
                    );

                return (
                    Number.isInteger(id) &&
                    id > max
                )
                    ? id
                    : max;
            },
            0
        );

    for (
        const original of
        items
    ) {
        const copy = {
            ...original
        };

        let id =
            Number(
                copy.id
            );

        if (
            !Number.isInteger(id) ||
            id <= 0 ||
            seen.has(id)
        ) {
            id =
                ++maxId;
        }

        seen.add(
            id
        );

        copy.id =
            id;

        if (
            copy.key === undefined ||
            copy.key === null ||
            copy.key === ""
        ) {
            copy.key =
                slugify(
                    copy.title ||
                    copy.label ||
                    copy.name ||
                    copy.type ||
                    `${prefix}-${id}`
                );
        }

        result.push(
            copy
        );
    }

    return result;
}

/*
 * IDs dos modais pertencem à tabela modal,
 * então eles precisam ser únicos globalmente.
 */
function ensureGlobalModalIds(
    config
) {
    const allModal = [];

    for (
        const project of
        config.projects || []
    ) {
        for (
            const modal of
            project.modal || []
        ) {
            allModal.push(
                modal
            );
        }
    }

    let maxId =
        allModal.reduce(
            (
                max,
                modal
            ) => {
                const id =
                    Number(
                        modal?.id
                    );

                return (
                    Number.isInteger(id) &&
                    id > max
                )
                    ? id
                    : max;
            },
            0
        );

    const seen =
        new Set();

    for (
        const project of
        config.projects || []
    ) {
        if (
            !Array.isArray(
                project.modal
            )
        ) {
            project.modal = [];

            continue;
        }

        for (
            const modal of
            project.modal
        ) {
            let id =
                Number(
                    modal.id
                );

            if (
                !Number.isInteger(id) ||
                id <= 0 ||
                seen.has(id)
            ) {
                id =
                    ++maxId;
            }

            seen.add(
                id
            );

            modal.id =
                id;
        }
    }
}

/*
|--------------------------------------------------------------------------
| MERGE DE CONFIG
|--------------------------------------------------------------------------
*/

function deepMerge(
    base,
    incoming
) {
    if (
        Array.isArray(
            base
        )
    ) {
        return Array.isArray(
            incoming
        )
            ? incoming
            : base;
    }

    if (
        base &&
        typeof base === "object"
    ) {
        const result = {
            ...base
        };

        if (
            incoming &&
            typeof incoming === "object"
        ) {
            for (
                const [
                    key,
                    value
                ] of Object.entries(
                    incoming
                )
            ) {
                result[key] =
                    key in result
                        ? deepMerge(
                            result[key],
                            value
                        )
                        : value;
            }
        }

        return result;
    }

    return (
        incoming ??
        base
    );
}

/*
|--------------------------------------------------------------------------
| ARQUIVO DE CONFIG
|--------------------------------------------------------------------------
*/

function saveJson(
    config
) {
    fs.mkdirSync(
        CONFIG_DIR,
        {
            recursive: true
        }
    );

    fs.writeFileSync(
        CONFIG_FILE,
        `${JSON.stringify(
            config,
            null,
            4
        )}\n`,
        "utf8"
    );
}

function loadJson() {
    if (
        !fs.existsSync(
            CONFIG_FILE
        )
    ) {
        return null;
    }

    const raw =
        fs.readFileSync(
            CONFIG_FILE,
            "utf8"
        );

    try {
        return JSON.parse(
            raw
        );
    } catch (
    error
    ) {
        throw new Error(
            `./config/index.json existe, mas não contém JSON válido: ${error.message}`
        );
    }
}

/*
|--------------------------------------------------------------------------
| SEEDS
|--------------------------------------------------------------------------
*/

function findFirstExisting(
    relativePaths
) {
    for (
        const relativePath of
        relativePaths
    ) {
        const absolutePath =
            path.join(
                ROOT,
                relativePath
            );

        if (
            fs.existsSync(
                absolutePath
            )
        ) {
            return absolutePath;
        }
    }

    return null;
}

function extractInsertSpec(
    seedPath
) {
    if (
        !seedPath ||
        !fs.existsSync(
            seedPath
        )
    ) {
        return null;
    }

    const source =
        fs.readFileSync(
            seedPath,
            "utf8"
        );

    const match =
        source.match(
            /INSERT\s+(?<modifier>OR\s+\w+\s+)?INTO\s+(?<table>[A-Za-z0-9_]+)\s*\((?<columns>[^)]+)\)\s*VALUES\s*\((?<values>[^)]+)\)/i
        );

    if (
        !match?.groups
    ) {
        return null;
    }

    const columns =
        match.groups.columns
            .split(",")
            .map(
                (column) =>
                    column
                        .trim()
                        .replace(
                            /[\[\]`"']/g,
                            ""
                        )
            )
            .filter(Boolean);

    const values =
        match.groups.values
            .split(",")
            .map(
                (value) =>
                    value.trim()
            )
            .filter(Boolean);

    let modifier =
        (
            match.groups.modifier ||
            "OR IGNORE"
        ).trim();

    if (
        !/^OR\s+(IGNORE|REPLACE)$/i.test(
            modifier
        )
    ) {
        modifier =
            "OR IGNORE";
    }

    return {
        table:
            match.groups.table.trim(),

        columns,

        valuesCount:
            values.length,

        modifier
    };
}

function resolveSeedSpec(
    key,
    fallback
) {
    const seedPath =
        findFirstExisting(
            SEED_CANDIDATES[key]
        );

    return {
        path:
            seedPath,

        spec:
            extractInsertSpec(
                seedPath
            ) ||
            fallback
    };
}

function defaultSeedSpecs() {
    return {
        infos: {
            table:
                "infos",

            columns: [
                "id",
                "name",
                "company",
                "occupation",
                "description",
                "footer",
                "email",
                "phone",
                "whatsapp",
                "location"
            ],

            modifier:
                "OR IGNORE"
        },

        pages: {
            table:
                "navbar_links",

            columns: [
                "id",
                "label",
                "function",
                "url",
                "type_id"
            ],

            modifier:
                "OR IGNORE"
        },

        types: {
            table:
                "project_type",

            columns: [
                "id",
                "type",
                "status"
            ],

            modifier:
                "OR IGNORE"
        },

        projects: {
            table:
                "project",

            columns: [
                "id",
                "title",
                "description",
                "external_url",
                "type_id",
                "status"
            ],

            modifier:
                "OR IGNORE"
        },

        modal: {
            table:
                "modal",

            columns: [
                "id",
                "project_id",
                "text",
                "extension"
            ],

            modifier:
                "OR IGNORE"
        },

        homeCards: {
            table:
                "home_cards",

            columns: [
                "id",
                "title",
                "text",
                "class",
                "icon",
                "link_id",
                "type_id"
            ],

            modifier:
                "OR IGNORE"
        }
    };
}

function renderSeed(
    functionName,
    variableName,
    spec,
    rows,
    extraCode = ""
) {
    const columnList =
        spec.columns.join(
            ", "
        );

    const placeholders =
        spec.columns
            .map(
                () => "?"
            )
            .join(
                ", "
            );

    const rowsCode =
        rows.length
            ? `\n${rows
                .map(
                    (row) =>
                        `        ${toJs(row)}`
                )
                .join(",\n")}\n    `
            : "\n    ";

    const statement =
        `INSERT ${spec.modifier} INTO ${spec.table}(${columnList}) VALUES (${placeholders})`;

    const indexRequire =
        functionName === "infosSeed"
            ? "../index"
            : "../../index";

    return `const { sqlite } = require("${indexRequire}");

function ${functionName}(){
    const insert = sqlite.prepare(\`${statement}\`);

    const ${variableName} = [${rowsCode}];

    ${variableName}.map((data) => {
        insert.run(...data);
    });
${extraCode
            ? `\n${extraCode}\n`
            : ""}}

module.exports = { ${functionName} };
`;
}

/*
|--------------------------------------------------------------------------
| TERMINAL
|--------------------------------------------------------------------------
*/

function ask(
    rl,
    prompt
) {
    return new Promise(
        (resolve) =>
            rl.question(
                prompt,
                resolve
            )
    );
}

function displayValue(
    value
) {
    return value === ""
        ? "(vazio)"
        : String(value);
}

async function askRequired(
    rl,
    prompt,
    original = undefined
) {
    while (true) {
        if (
            original !== undefined
        ) {
            console.log(
                `\nValor atual:\n  ${displayValue(
                    normalizeText(
                        original
                    )
                )}`
            );
        }

        const answer =
            normalizeText(
                await ask(
                    rl,
                    `${prompt}\n> `
                )
            );

        if (!answer) {
            const hasOriginal =
                original !== undefined &&
                original !== null &&
                normalizeText(
                    original
                ) !== "";

            if (
                hasOriginal
            ) {
                const value =
                    normalizeText(
                        original
                    );

                const accepted =
                    await confirm(
                        rl,
                        `Confirme este valor:\n  ${displayValue(
                            value
                        )}`
                    );

                if (
                    accepted
                ) {
                    return value;
                }

                continue;
            }

            console.log(
                "Este campo é obrigatório. Digite um valor para continuar."
            );

            continue;
        }

        const accepted =
            await confirm(
                rl,
                `Confirme este valor:\n  ${displayValue(
                    answer
                )}`
            );

        if (
            accepted
        ) {
            return answer;
        }
    }
}

async function askOptional(
    rl,
    prompt,
    original = undefined
) {
    if (
        original !== undefined
    ) {
        console.log(
            `\nValor atual:\n  ${displayValue(
                normalizeText(
                    original
                )
            )}`
        );
    }

    while (true) {
        const answer =
            normalizeText(
                await ask(
                    rl,
                    `${prompt}\n> `
                )
            );

        if (!answer) {
            const hasOriginal =
                original !== undefined &&
                original !== null &&
                normalizeText(
                    original
                ) !== "";

            if (
                hasOriginal
            ) {
                const value =
                    normalizeText(
                        original
                    );

                const accepted =
                    await confirm(
                        rl,
                        `Confirme este valor:\n  ${displayValue(
                            value
                        )}`
                    );

                if (
                    accepted
                ) {
                    return value;
                }

                continue;
            }

            const accepted =
                await confirm(
                    rl,
                    "Confirme este valor:\n  (vazio)"
                );

            if (
                accepted
            ) {
                return "";
            }

            continue;
        }

        const accepted =
            await confirm(
                rl,
                `Confirme este valor:\n  ${displayValue(
                    answer
                )}`
            );

        if (
            accepted
        ) {
            return answer;
        }
    }
}

async function confirm(
    rl,
    message
) {
    console.log(
        `\n${message}`
    );

    while (true) {
        const value =
            normalizeText(
                await ask(
                    rl,
                    "\nEstá correto? [S/N]\n> "
                )
            ).toLowerCase();

        if (
            value === "s" ||
            value === "sim"
        ) {
            return true;
        }

        if (
            value === "n" ||
            value === "nao" ||
            value === "não"
        ) {
            return false;
        }

        console.log(
            "Digite S para confirmar ou N para refazer."
        );
    }
}

async function choose(
    rl,
    title,
    options
) {
    console.log(
        `\n${title}`
    );

    options.forEach(
        (
            option,
            index
        ) => {
            console.log(
                `[${index + 1}] ${option.label}`
            );
        }
    );

    while (true) {
        const value =
            normalizeText(
                await ask(
                    rl,
                    "> "
                )
            );

        const index =
            Number(value) - 1;

        if (
            Number.isInteger(index) &&
            options[index]
        ) {
            return options[
                index
            ].value;
        }

        console.log(
            "Opção inválida."
        );
    }
}

async function askColor(
    rl,
    label,
    original
) {
    while (true) {
        console.log(
            `\nValor atual:\n  ${displayValue(
                original
            )}`
        );

        const answer =
            normalizeText(
                await ask(
                    rl,
                    `${label}\n> `
                )
            );

        if (!answer) {
            const accepted =
                await confirm(
                    rl,
                    `Confirme este valor:\n  ${displayValue(
                        original
                    )}`
                );

            if (
                accepted
            ) {
                return original;
            }

            continue;
        }

        const accepted =
            await confirm(
                rl,
                `Confirme este valor:\n  ${displayValue(
                    answer
                )}`
            );

        if (
            accepted
        ) {
            return answer;
        }
    }
}
/*
|--------------------------------------------------------------------------
| OBJETOS
|--------------------------------------------------------------------------
*/

async function editObject(
    rl,
    title,
    object,
    fields
) {
    console.log(
        "\n════════════════════════════════════════"
    );

    console.log(
        title
    );

    console.log(
        "════════════════════════════════════════"
    );

    for (
        const field of
        fields
    ) {
        const current =
            object[
            field.key
            ];

        object[
            field.key
        ] =
            field.optional
                ? await askOptional(
                    rl,
                    field.label,
                    current
                )
                : await askRequired(
                    rl,
                    field.label,
                    current
                );
    }
}
/*
|--------------------------------------------------------------------------
| INFORMAÇÕES / CONTATOS
|--------------------------------------------------------------------------
*/

async function editCompany(
    rl,
    config
) {
    await editObject(
        rl,
        "1/7 — INFORMAÇÕES PROFISSIONAIS",
        config.company,
        [
            {
                key:
                    "name",

                label:
                    "Nome profissional / nome exibido",

                optional:
                    true
            },

            {
                key:
                    "company",

                label:
                    "Razão social",

                optional:
                    true
            },

            {
                key:
                    "occupation",

                label:
                    "Ocupação",

                optional:
                    true
            },

            {
                key:
                    "description",

                label:
                    "Descrição principal",

                optional:
                    true
            },

            {
                key:
                    "footer",

                label:
                    "Texto do rodapé",

                optional:
                    true
            }
        ]
    );

    await editObject(
        rl,
        "2/7 — CONTATOS",
        config.contacts,
        [
            {
                key:
                    "email",

                label:
                    "E-mail",

                optional:
                    true
            },

            {
                key:
                    "phone",

                label:
                    "Telefone",

                optional:
                    true
            },

            {
                key:
                    "whatsapp",

                label:
                    "WhatsApp",

                optional:
                    true
            },

            {
                key:
                    "address",

                label:
                    "Endereço / localização",

                optional:
                    true
            }
        ]
    );
}

/*
|--------------------------------------------------------------------------
| TYPES
|--------------------------------------------------------------------------
*/

async function createTypeItem(
    rl,
    current = null,
    config
) {
    const item =
        current
            ? {
                ...current
            }
            : {
                id:
                    0,

                key:
                    "",

                type:
                    "",

                name:
                    "",

                slug:
                    "",

                status:
                    1
            };

    item.id =
        nextId(
            config.types,
            current?.id
        );

    while (true) {
        item.name =
            await askRequired(
                rl,
                "Nome do tipo / categoria",
                current?.name ||
                (
                    current?.type &&
                        !current?.name
                        ? current.type
                        : undefined
                )
            );

        const generatedType =
            slugify(
                item.name
            );

        if (
            !generatedType
        ) {
            console.log(
                "Não foi possível gerar um controle válido para este tipo."
            );

            continue;
        }

        const duplicated =
            config.types.some(
                (type) =>
                    Number(
                        type.id
                    ) !==
                    Number(
                        item.id
                    ) &&
                    type.type ===
                    generatedType
            );

        if (
            duplicated
        ) {
            console.log(
                `Já existe uma categoria com o controle "${generatedType}".`
            );

            continue;
        }

        item.type =
            generatedType;

        item.key =
            generatedType;

        item.slug =
            generatedType;

        break;
    }

    item.status =
        await choose(
            rl,
            "Status da categoria:",
            [
                {
                    label:
                        "Ativo",

                    value:
                        1
                },

                {
                    label:
                        "Inativo",

                    value:
                        0
                }
            ]
        );

    return item;
}

async function editTypes(
    rl,
    config
) {
    config.types =
        await editCollection(
            rl,
            "3/7 — CATEGORIAS / TYPES",
            config.types,

            (
                currentRl,
                current
            ) =>
                createTypeItem(
                    currentRl,
                    current,
                    config
                ),

            (item) => {
                console.log(
                    `${item.id}. ${item.name}`
                );

                console.log(
                    `   controle: ${item.type}`
                );

                console.log(
                    `   status: ${item.status
                        ? "ativo"
                        : "inativo"
                    }`
                );
            }
        );

    if (
        !config.types.length
    ) {
        throw new Error(
            "Cadastre pelo menos uma categoria."
        );
    }

    config.types =
        ensureIds(
            config.types,
            "tipo"
        );
}

/*
|--------------------------------------------------------------------------
| NAVIGATION
|--------------------------------------------------------------------------
*/

function getNavigationFunctionSet(
    config,
    additionalLinks = [],
    excludeId = null
) {
    const all = [
        ...(config.navigation || []),
        ...(additionalLinks || [])
    ];

    return new Set(
        all
            .filter(
                (link) =>
                    excludeId === null ||
                    Number(
                        link.id
                    ) !==
                    Number(
                        excludeId
                    )
            )
            .map(
                (link) =>
                    normalizeText(
                        link.function
                    ).toLowerCase()
            )
            .filter(Boolean)
    );
}

function isReservedFunction(
    value
) {
    const functionName =
        normalizeText(
            value
        ).toLowerCase();

    return (
        functionName ===
        "homepage" ||
        functionName ===
        "contactpage"
    );
}

function isReservedUrl(
    value
) {
    const url =
        normalizeText(
            value
        );

    return (
        url === "/" ||
        url === "/contato"
    );
}

/*
|--------------------------------------------------------------------------
| HOMEPAGE
|--------------------------------------------------------------------------
*/

async function editHomePage(
    rl,
    current,
    config
) {
    const item =
        current
            ? {
                ...current
            }
            : {
                id:
                    0,

                label:
                    "",

                function:
                    "HomePage",

                url:
                    "/",

                typeKey:
                    "",

                typeId:
                    null
            };

    item.id =
        nextId(
            config.navigation,
            current?.id
        );

    /*
     * ÚNICA pergunta da HomePage.
     */
    item.label =
        await askRequired(
            rl,
            "Nome exibido da HomePage",
            current?.label
        );

    /*
     * Dados padronizados.
     */
    item.function =
        "HomePage";

    item.url =
        "/";

    item.typeKey =
        "";

    item.typeId =
        null;

    return item;
}

/*
|--------------------------------------------------------------------------
| OUTROS LINKS
|--------------------------------------------------------------------------
*/

async function createNavigationItem(
    rl,
    current = null,
    config,
    additionalLinks = []
) {
    const item =
        current
            ? {
                ...current
            }
            : {
                id:
                    0,

                label:
                    "",

                function:
                    "",

                url:
                    "",

                typeKey:
                    "",

                typeId:
                    null
            };

    item.id =
        nextId(
            config.navigation,
            current?.id
        );

    /*
     * 1. LABEL
     */
    item.label =
        await askRequired(
            rl,
            "Nome exibido do link",
            current?.label
        );

    /*
     * 2. URL
     */
    while (true) {
        item.url =
            await askRequired(
                rl,
                "URL/rota do link",
                current?.url
            );

        if (
            isReservedUrl(
                item.url
            )
        ) {
            console.log(
                "Esta URL é reservada para HomePage (/) ou ContactPage (/contato)."
            );

            continue;
        }

        break;
    }

    /*
     * 3. CATEGORIA
     */
    const typeOptions = [
        {
            label:
                "Sem categoria / type_id = null",

            value: {
                typeKey:
                    "",

                typeId:
                    null
            }
        },

        ...config.types.map(
            (type) => ({
                label:
                    `${type.id} — ${type.name}`,

                value: {
                    typeKey:
                        type.key,

                    typeId:
                        type.id
                }
            })
        )
    ];

    while (true) {
        const selected =
            await choose(
                rl,
                "Categoria do link (type_id):",
                typeOptions
            );

        item.typeKey =
            selected.typeKey;

        item.typeId =
            selected.typeId;

        const matchingType =
            item.typeId === null
                ? null
                : config.types.find(
                    (type) =>
                        Number(
                            type.id
                        ) ===
                        Number(
                            item.typeId
                        )
                );

        let functionName;

        /*
         * 4. FUNCTION
         *
         * É o último dado lógico do link.
         *
         * Com type_id:
         *     geração automática.
         *
         * Sem type_id:
         *     pergunta ao usuário.
         */
        if (
            matchingType
        ) {
            functionName =
                componentPageName(
                    matchingType.name
                );

            console.log(
                `Função React gerada automaticamente: ${functionName}`
            );
        } else {
            functionName =
                await askRequired(
                    rl,
                    "Função/página React",
                    current?.function
                );

            if (
                isReservedFunction(
                    functionName
                )
            ) {
                console.log(
                    "HomePage e ContactPage possuem cadastro exclusivo e não podem ser usadas em outros links."
                );

                continue;
            }
        }

        /*
         * Evita duas páginas apontando para a mesma function.
         */
        const usedFunctions =
            getNavigationFunctionSet(
                config,
                additionalLinks,
                item.id
            );

        if (
            usedFunctions.has(
                functionName.toLowerCase()
            )
        ) {
            console.log(
                `A função React "${functionName}" já está sendo usada por outro link.`
            );

            if (
                matchingType
            ) {
                console.log(
                    "Escolha outra categoria para gerar uma função diferente."
                );
            } else {
                console.log(
                    "Informe outra função React que ainda não esteja sendo usada."
                );
            }

            continue;
        }

        item.function =
            functionName;

        break;
    }

    return item;
}

function printNavigationItem(
    item
) {
    console.log(
        `${item.id}. ${item.label} → ${item.url}`
    );

    console.log(
        `   função: ${item.function}`
    );

    console.log(
        `   type_id: ${item.typeId ?? "null"}`
    );
}

async function editNavigationOthers(
    rl,
    config,
    items
) {
    const result = [];

    for (
        let index = 0;
        index < items.length;
        index++
    ) {
        const item =
            items[index];

        console.log(
            `\n[${index + 1}/${items.length}]`
        );

        printNavigationItem(
            item
        );

        const action =
            await choose(
                rl,
                "O que deseja fazer?",
                [
                    {
                        label:
                            "Manter",

                        value:
                            "keep"
                    },

                    {
                        label:
                            "Editar",

                        value:
                            "edit"
                    },

                    {
                        label:
                            "Remover",

                        value:
                            "remove"
                    }
                ]
            );

        if (
            action ===
            "keep"
        ) {
            result.push({
                ...item
            });

            const accepted =
                await confirm(
                    rl,
                    "Item mantido sem alterações."
                );

            if (
                !accepted
            ) {
                result.pop();

                result.push(
                    await createNavigationItem(
                        rl,
                        item,
                        config,
                        result
                    )
                );
            }

            continue;
        }

        if (
            action ===
            "remove"
        ) {
            const remove =
                await confirm(
                    rl,
                    "Confirme a remoção deste item."
                );

            if (
                !remove
            ) {
                result.push({
                    ...item
                });
            }

            continue;
        }

        result.push(
            await createNavigationItem(
                rl,
                item,
                config,
                result
            )
        );
    }

    /*
     * NOVOS LINKS
     */
    while (true) {
        const add =
            await choose(
                rl,
                "Deseja adicionar outro link?",
                [
                    {
                        label:
                            "Sim",

                        value:
                            true
                    },

                    {
                        label:
                            "Não",

                        value:
                            false
                    }
                ]
            );

        if (
            !add
        ) {
            break;
        }

        const newItem =
            await createNavigationItem(
                rl,
                null,
                config,
                result
            );

        result.push(
            newItem
        );
    }

    return result;
}

/*
|--------------------------------------------------------------------------
| CONTACT PAGE
|--------------------------------------------------------------------------
*/

async function editContactLink(
    rl,
    current,
    config
) {
    const addContact =
        await choose(
            rl,
            current
                ? "Deseja manter/adicionar a zona de contatos?"
                : "Deseja adicionar uma zona de contatos?",
            [
                {
                    label:
                        "Sim",

                    value:
                        true
                },

                {
                    label:
                        "Não",

                    value:
                        false
                }
            ]
        );

    if (
        !addContact
    ) {
        return null;
    }

    const item =
        current
            ? {
                ...current
            }
            : {
                id:
                    0,

                label:
                    "",

                function:
                    "ContactPage",

                url:
                    "/contato",

                typeKey:
                    "",

                typeId:
                    null
            };

    item.id =
        nextId(
            config.navigation,
            current?.id
        );

    /*
     * ÚNICA pergunta do ContactPage.
     */
    item.label =
        await askRequired(
            rl,
            "Nome exibido da zona de contatos",
            current?.label
        );

    /*
     * Dados padronizados.
     */
    item.function =
        "ContactPage";

    item.url =
        "/contato";

    item.typeKey =
        "";

    item.typeId =
        null;

    return item;
}

/*
|--------------------------------------------------------------------------
| EDIÇÃO DA NAVEGAÇÃO
|--------------------------------------------------------------------------
*/

async function editNavigation(
    rl,
    config
) {
    console.log(
        "\n════════════════════════════════════════"
    );

    console.log(
        "4/7 — NAVBAR / PAGES"
    );

    console.log(
        "════════════════════════════════════════"
    );

    const existingNavigation =
        Array.isArray(
            config.navigation
        )
            ? config.navigation
            : [];

    /*
     * Encontra a HomePage existente.
     *
     * A URL "/" também é considerada HomePage
     * para compatibilidade com configs antigas.
     */
    const currentHome =
        existingNavigation.find(
            (link) =>
                link.function ===
                "HomePage" ||
                link.url === "/"
        ) ||
        null;

    /*
     * Encontra ContactPage existente.
     *
     * A URL "/contato" também é considerada.
     */
    const currentContact =
        existingNavigation.find(
            (link) =>
                link.function ===
                "ContactPage" ||
                link.url ===
                "/contato"
        ) ||
        null;

    /*
     * Remove HomePage e ContactPage
     * dos "outros links".
     */
    const otherLinks =
        existingNavigation.filter(
            (link) =>
                link !==
                currentHome &&
                link !==
                currentContact
        );

    /*
     * =========================================================
     * 1 — HOMEPAGE
     * =========================================================
     */
    const home =
        await editHomePage(
            rl,
            currentHome,
            config
        );

    /*
     * Mantemos a navegação antiga temporariamente
     * para que os IDs e funções existentes sejam respeitados
     * durante a edição dos outros links.
     */
    const previousNavigation =
        config.navigation;

    config.navigation =
        existingNavigation;

    /*
     * =========================================================
     * 2 — OUTROS LINKS
     * =========================================================
     */
    const others =
        await editNavigationOthers(
            rl,
            config,
            otherLinks
        );

    /*
     * A ordem agora fica:
     *
     * HomePage
     * Outros links
     */
    config.navigation = [
        home,
        ...others
    ];

    /*
     * =========================================================
     * 3 — CONTATO
     * =========================================================
     */
    const contact =
        await editContactLink(
            rl,
            currentContact,
            {
                ...config,

                navigation: [
                    ...config.navigation,
                    ...(previousNavigation || [])
                ]
            }
        );

    /*
     * ContactPage sempre por último.
     */
    if (
        contact
    ) {
        config.navigation.push(
            contact
        );
    }

    config.navigation =
        ensureIds(
            config.navigation,
            "link"
        );
}

/*
|--------------------------------------------------------------------------
| PROJETOS / MODAIS
|--------------------------------------------------------------------------
*/

async function createModalItem(
    rl,
    current = null
) {
    const item =
        current
            ? {
                ...current
            }
            : {
                id:
                    0,

                text:
                    "",

                extension:
                    ".png"
            };

    item.text =
        await askRequired(
            rl,
            "Texto do modal",
            current?.text
        );

    item.extension =
        await askRequired(
            rl,
            "Extensão da imagem",
            current?.extension ||
            ".png"
        );

    return item;
}

async function createProjectItem(
    rl,
    current = null,
    config
) {
    const item =
        current
            ? {
                ...current,

                modal:
                    Array.isArray(
                        current.modal
                    )
                        ? current.modal.map(
                            (modal) => ({
                                ...modal
                            })
                        )
                        : []
            }
            : {
                id:
                    0,

                key:
                    "",

                title:
                    "",

                description:
                    "",

                externalUrl:
                    "",

                typeKey:
                    "",

                status:
                    1,

                modal:
                    []
            };

    /*
     * ID automático.
     */
    item.id =
        nextId(
            config.projects,
            current?.id
        );

    item.title =
        await askRequired(
            rl,
            "Título do projeto/serviço",
            current?.title
        );

    /*
     * O slug do projeto continua sendo informado,
     * pois ele é usado para a pasta ./config/projetos.
     */
    item.key =
        await askRequired(
            rl,
            "Chave/slug do projeto",
            current?.key ||
            slugify(
                item.title
            )
        );

    item.description =
        await askRequired(
            rl,
            "Descrição do projeto/serviço",
            current?.description
        );

    if (
        !config.types.length
    ) {
        throw new Error(
            "Cadastre pelo menos uma categoria antes dos projetos."
        );
    }

    item.typeKey =
        await choose(
            rl,
            "Categoria do projeto:",
            config.types.map(
                (type) => ({
                    label:
                        `${type.id} — ${type.name}`,

                    value:
                        type.key
                })
            )
        );

    item.externalUrl =
        await askOptional(
            rl,
            "URL externa (opcional)",
            current?.externalUrl ??
            ""
        );

    item.status =
        await choose(
            rl,
            "Status do projeto:",
            [
                {
                    label:
                        "Ativo",

                    value:
                        1
                },

                {
                    label:
                        "Inativo",

                    value:
                        0
                }
            ]
        );

    const hasModal =
        await choose(
            rl,
            "Deseja preencher as informações do modal deste projeto agora?",
            [
                {
                    label:
                        "Sim",

                    value:
                        true
                },

                {
                    label:
                        "Não",

                    value:
                        false
                }
            ]
        );

    if (
        hasModal
    ) {
        item.modal =
            await editCollection(
                rl,
                `5/7 — MODAL: ${item.title}`,
                item.modal,
                createModalItem,

                (
                    modal,
                    index
                ) => {
                    console.log(
                        `${index + 1}. ${modal.text}`
                    );

                    console.log(
                        `   extensão: ${modal.extension}`
                    );
                }
            );
    }

    return item;
}

async function editProjects(
    rl,
    config
) {
    config.projects =
        await editCollection(
            rl,
            "5/7 — PROJETOS / SERVIÇOS",
            config.projects,

            (
                currentRl,
                current
            ) =>
                createProjectItem(
                    currentRl,
                    current,
                    config
                ),

            (item) => {
                console.log(
                    `${item.id}. ${item.title} — categoria: ${item.typeKey}`
                );
            }
        );

    config.projects =
        ensureIds(
            config.projects,
            "projeto"
        );

    ensureGlobalModalIds(
        config
    );
}

/*
|--------------------------------------------------------------------------
| HOME CARDS
|--------------------------------------------------------------------------
*/

async function createHomeCardItem(
    rl,
    current = null,
    config
) {
    const item =
        current
            ? {
                ...current
            }
            : {
                id:
                    0,

                title:
                    "",

                text:
                    "",

                class:
                    "",

                icon:
                    "",

                linkId:
                    null,

                typeKey:
                    "",

                typeId:
                    null
            };

    /*
     * ID automático.
     */
    item.id =
        nextId(
            config.homeCards,
            current?.id
        );

    /*
     * TÍTULO
     */
    item.title =
        await askRequired(
            rl,
            "Título do card",
            current?.title
        );

    /*
     * TEXTO
     */
    item.text =
        await askRequired(
            rl,
            "Texto do card",
            current?.text
        );

    /*
     * ÍCONE
     */
    item.icon =
        await askRequired(
            rl,
            "Nome do ícone",
            current?.icon
        );

    /*
     * LINK
     *
     * O link agora é a origem de:
     *
     * - class
     * - typeId
     * - typeKey
     *
     * Portanto o card precisa estar associado
     * a um link.
     */
    const linkOptions =
        config.navigation.map(
            (link) => ({
                label:
                    `${link.id} — ${link.label} (${link.function})`,

                value:
                    link.id
            })
        );

    if (
        !linkOptions.length
    ) {
        throw new Error(
            "É necessário cadastrar pelo menos um link antes dos cards da Home."
        );
    }

    item.linkId =
        await choose(
            rl,
            "Link do card:",
            linkOptions
        );

    /*
     * Localiza o link selecionado.
     */
    const linked =
        config.navigation.find(
            (link) =>
                Number(
                    link.id
                ) ===
                Number(
                    item.linkId
                )
        );

    if (
        !linked
    ) {
        throw new Error(
            `Link ${item.linkId} não encontrado para o card "${item.title}".`
        );
    }

    /*
     * CLASS
     *
     * function:
     *
     * DeclaracoesFiscaisPage
     *
     * vira:
     *
     * declaracoesfiscaIs
     *
     * sem Page + lowercase.
     */
    item.class =
        getHomeCardClass(
            linked.function
        );

    /*
     * TYPE
     *
     * Herdado diretamente do link.
     */
    item.typeId =
        linked.typeId ??
        null;

    item.typeKey =
        linked.typeKey ??
        "";

    return item;
}

async function editHomeCards(
    rl,
    config
) {
    config.homeCards =
        await editCollection(
            rl,
            "6/7 — CARDS DA HOME",
            config.homeCards,

            (
                currentRl,
                current
            ) =>
                createHomeCardItem(
                    currentRl,
                    current,
                    config
                ),

            (item) => {
                console.log(
                    `${item.id}. ${item.title}`
                );

                console.log(
                    `   link_id: ${item.linkId ?? "null"}`
                );

                console.log(
                    `   classe: ${item.class}`
                );

                console.log(
                    `   type_id: ${item.typeId ?? "null"}`
                );
            }
        );

    config.homeCards =
        ensureIds(
            config.homeCards,
            "card"
        );
}

/*
|--------------------------------------------------------------------------
| THEME
|--------------------------------------------------------------------------
*/

async function editTheme(
    rl,
    config
) {
    console.log(
        "\n════════════════════════════════════════"
    );

    console.log(
        "7/7 — THEME"
    );

    console.log(
        "════════════════════════════════════════"
    );

    console.log(
        "O theme ainda não é utilizado pelas seeds."
    );

    console.log(
        "Ele será salvo no config/index.json para uso futuro."
    );

    const customize =
        await choose(
            rl,
            "Deseja personalizar o theme?",
            [
                {
                    label:
                        "Manter tema padrão/atual",

                    value:
                        false
                },

                {
                    label:
                        "Editar cores",

                    value:
                        true
                }
            ]
        );

    if (
        !customize
    ) {
        const accepted =
            await confirm(
                rl,
                "O theme atual será mantido."
            );

        if (
            !accepted
        ) {
            return editTheme(
                rl,
                config
            );
        }

        return;
    }

    config.theme.primary =
        await askColor(
            rl,
            "Cor primary",
            config.theme.primary
        );

    config.theme.secondary =
        await askColor(
            rl,
            "Cor secondary",
            config.theme.secondary
        );

    config.theme.outline =
        await askColor(
            rl,
            "Cor outline",
            config.theme.outline
        );

    config.theme.background =
        await askColor(
            rl,
            "Cor background",
            config.theme.background
        );

    config.theme.backgroundLight =
        await askColor(
            rl,
            "Cor backgroundLight",
            config.theme.backgroundLight
        );

    config.theme.white =
        await askColor(
            rl,
            "Cor white",
            config.theme.white
        );
}

/*
|--------------------------------------------------------------------------
| COLEÇÕES
|--------------------------------------------------------------------------
*/

async function editCollection(
    rl,
    title,
    items,
    createItem,
    printItem
) {
    console.log(
        "\n════════════════════════════════════════"
    );

    console.log(
        title
    );

    console.log(
        "════════════════════════════════════════"
    );

    const sourceItems =
        Array.isArray(items)
            ? items
            : [];

    const result = [];

    /*
     * Itens existentes.
     */
    for (
        let index = 0;
        index < sourceItems.length;
        index++
    ) {
        const item =
            sourceItems[
            index
            ];

        console.log(
            `\n[${index + 1}/${sourceItems.length}]`
        );

        printItem(
            item,
            index
        );

        const action =
            await choose(
                rl,
                "O que deseja fazer?",
                [
                    {
                        label:
                            "Manter",

                        value:
                            "keep"
                    },

                    {
                        label:
                            "Editar",

                        value:
                            "edit"
                    },

                    {
                        label:
                            "Remover",

                        value:
                            "remove"
                    }
                ]
            );

        /*
         * MANTER
         */
        if (
            action ===
            "keep"
        ) {
            result.push({
                ...item
            });

            const accepted =
                await confirm(
                    rl,
                    "Item mantido sem alterações."
                );

            if (
                !accepted
            ) {
                result.pop();

                result.push(
                    await createItem(
                        rl,
                        item,
                        true
                    )
                );
            }

            continue;
        }

        /*
         * REMOVER
         */
        if (
            action ===
            "remove"
        ) {
            const remove =
                await confirm(
                    rl,
                    "Confirme a remoção deste item."
                );

            if (
                !remove
            ) {
                result.push({
                    ...item
                });
            }

            continue;
        }

        /*
         * EDITAR
         */
        result.push(
            await createItem(
                rl,
                item,
                true
            )
        );
    }

    /*
     * NOVOS ITENS
     */
    while (true) {
        const add =
            await choose(
                rl,
                "Deseja adicionar outro item?",
                [
                    {
                        label:
                            "Sim",

                        value:
                            true
                    },

                    {
                        label:
                            "Não",

                        value:
                            false
                    }
                ]
            );

        if (
            !add
        ) {
            break;
        }

        result.push(
            await createItem(
                rl,
                null,
                false
            )
        );
    }

    return result;
}

/*
|--------------------------------------------------------------------------
| NORMALIZAÇÃO DE COLUNAS
|--------------------------------------------------------------------------
*/

function normalizeColumnName(
    column
) {
    return column
        .replace(
            /[\[\]`"']/g,
            ""
        )
        .trim()
        .toLowerCase();
}

function buildRow(
    columns,
    context
) {
    return columns.map(
        (column) =>
            valueForColumn(
                column,
                context
            )
    );
}

function valueForColumn(
    column,
    context
) {
    const key =
        normalizeColumnName(
            column
        );

    /*
     * Correspondência direta.
     */
    if (
        context[key] !== undefined
    ) {
        return context[key];
    }

    const aliases = {
        name: [
            "name"
        ],

        trade_name: [
            "name"
        ],

        company: [
            "company"
        ],

        legal_name: [
            "company"
        ],

        occupation: [
            "occupation"
        ],

        description: [
            "description"
        ],

        footer: [
            "footer"
        ],

        email: [
            "email"
        ],

        phone: [
            "phone"
        ],

        whatsapp: [
            "whatsapp"
        ],

        location: [
            "location",
            "address"
        ],

        address: [
            "address",
            "location"
        ],

        label: [
            "label",
            "name",
            "title"
        ],

        function: [
            "function"
        ],

        url: [
            "url"
        ],

        type: [
            "type",
            "name",
            "typeName"
        ],

        type_id: [
            "typeId"
        ],

        external_url: [
            "externalUrl"
        ],

        link_id: [
            "linkId"
        ],

        title: [
            "title",
            "name"
        ],

        text: [
            "text",
            "description"
        ],

        class: [
            "class"
        ],

        icon: [
            "icon"
        ],

        status: [
            "status"
        ],

        slug: [
            "slug",
            "key"
        ],

        key: [
            "key",
            "slug"
        ],

        extension: [
            "extension"
        ],

        project_id: [
            "projectId"
        ],

        id: [
            "id"
        ]
    };

    for (
        const alias of
        aliases[key] ||
        []
    ) {
        if (
            context[alias] !== undefined
        ) {
            return context[
                alias
            ];
        }
    }

    return null;
}

/*
|--------------------------------------------------------------------------
| SEED: INFOS
|--------------------------------------------------------------------------
*/

function seedRowsForInfos(
    spec,
    config
) {
    const columns =
        spec.columns.map(
            normalizeColumnName
        );

    const isKeyValue =
        columns.includes(
            "key"
        ) &&
        columns.includes(
            "value"
        );

    if (
        isKeyValue
    ) {
        const pairs = [
            [
                "name",
                config.company.name
            ],

            [
                "company",
                config.company.company
            ],

            [
                "occupation",
                config.company.occupation
            ],

            [
                "description",
                config.company.description
            ],

            [
                "footer",
                config.company.footer
            ],

            [
                "email",
                config.contacts.email
            ],

            [
                "phone",
                config.contacts.phone
            ],

            [
                "whatsapp",
                config.contacts.whatsapp
            ],

            [
                "location",
                config.contacts.address
            ]
        ].filter(
            ([, value]) =>
                value !==
                undefined &&
                value !==
                null &&
                value !== ""
        );

        return pairs.map(
            (
                [
                    key,
                    value
                ],
                index
            ) =>
                buildRow(
                    spec.columns,
                    {
                        id:
                            index + 1,

                        key,

                        value,

                        name:
                            key,

                        title:
                            key
                    }
                )
        );
    }

    return [
        buildRow(
            spec.columns,
            {
                id:
                    1,

                company:
                    config.company.company,

                name:
                    config.company.name,

                occupation:
                    config.company.occupation,

                description:
                    config.company.description,

                footer:
                    config.company.footer,

                email:
                    config.contacts.email,

                phone:
                    config.contacts.phone,

                whatsapp:
                    config.contacts.whatsapp,

                location:
                    config.contacts.address,

                address:
                    config.contacts.address
            }
        )
    ];
}

/*
|--------------------------------------------------------------------------
| SEED: PAGES
|--------------------------------------------------------------------------
*/

function seedRowsForPages(
    spec,
    config
) {
    return config.navigation.map(
        (link) => {
            const type =
                config.types.find(
                    (item) =>
                        item.key ===
                        link.typeKey
                );

            const typeId =
                type?.id ??
                link.typeId ??
                null;

            return buildRow(
                spec.columns,
                {
                    id:
                        link.id,

                    label:
                        link.label,

                    function:
                        link.function,

                    url:
                        link.url,

                    typeId,

                    typeKey:
                        link.typeKey ||
                        ""
                }
            );
        }
    );
}

/*
|--------------------------------------------------------------------------
| SEED: TYPES
|--------------------------------------------------------------------------
*/

function seedRowsForTypes(
    spec,
    config
) {
    return config.types.map(
        (type) =>
            buildRow(
                spec.columns,
                {
                    id:
                        type.id,

                    /*
                     * A tabela usa "type"
                     * como controle interno.
                     */
                    type:
                        slugify(
                            type.name
                        ),

                    name:
                        type.name,

                    typeName:
                        type.name,

                    key:
                        type.key,

                    slug:
                        type.slug,

                    status:
                        type.status
                }
            )
    );
}

/*
|--------------------------------------------------------------------------
| SEED: PROJECTS
|--------------------------------------------------------------------------
*/

function seedRowsForProjects(
    spec,
    config
) {
    return config.projects.map(
        (project) => {
            const type =
                config.types.find(
                    (item) =>
                        item.key ===
                        project.typeKey
                );

            return buildRow(
                spec.columns,
                {
                    id:
                        project.id,

                    title:
                        project.title,

                    name:
                        project.title,

                    description:
                        project.description,

                    externalUrl:
                        project.externalUrl ||
                        null,

                    typeId:
                        type?.id ??
                        null,

                    typeKey:
                        project.typeKey,

                    status:
                        project.status
                }
            );
        }
    );
}

/*
|--------------------------------------------------------------------------
| SEED: MODAL
|--------------------------------------------------------------------------
*/

function seedRowsForModal(
    spec,
    config
) {
    const rows = [];

    let fallbackId =
        1;

    for (
        const project of
        config.projects
    ) {
        for (
            const modal of
            project.modal ||
            []
        ) {
            const modalId =
                isPositiveId(
                    modal.id
                )
                    ? Number(
                        modal.id
                    )
                    : fallbackId++;

            rows.push(
                buildRow(
                    spec.columns,
                    {
                        id:
                            modalId,

                        projectId:
                            project.id,

                        projectTitle:
                            project.title,

                        text:
                            modal.text,

                        extension:
                            modal.extension ||
                            ".png"
                    }
                )
            );
        }
    }

    return rows;
}

/*
|--------------------------------------------------------------------------
| SEED: HOME CARDS
|--------------------------------------------------------------------------
*/

function seedRowsForHomeCards(
    spec,
    config
) {
    return config.homeCards.map(
        (card) => {
            const link =
                config.navigation.find(
                    (item) =>
                        Number(
                            item.id
                        ) ===
                        Number(
                            card.linkId
                        )
                );

            const typeId =
                link?.typeId ??
                null;

            return buildRow(
                spec.columns,
                {
                    id:
                        card.id,

                    title:
                        card.title,

                    text:
                        card.text,

                    /*
                     * Herdada da function
                     * do link.
                     */
                    class:
                        link
                            ? getHomeCardClass(
                                link.function
                            )
                            : "",

                    icon:
                        card.icon,

                    /*
                     * FK -> navbar_links.id
                     */
                    linkId:
                        link?.id ??
                        null,

                    /*
                     * Herdado do link.
                     */
                    typeId,

                    /*
                     * Mantemos para
                     * compatibilidade interna.
                     */
                    typeKey:
                        link?.typeKey ??
                        ""
                }
            );
        }
    );
}

/*
|--------------------------------------------------------------------------
| ESCRITA DAS SEEDS
|--------------------------------------------------------------------------
*/

function writeSeed(
    key,
    config
) {
    const defaults =
        defaultSeedSpecs();

    const resolved =
        resolveSeedSpec(
            key,
            defaults[key]
        );

    const spec =
        resolved.spec;

    const definitions = {
        infos: [
            "infosSeed",
            "infos",
            seedRowsForInfos
        ],

        pages: [
            "pagesSeed",
            "pages",
            seedRowsForPages
        ],

        types: [
            "typesSeed",
            "types",
            seedRowsForTypes
        ],

        projects: [
            "projectsSeed",
            "projects",
            seedRowsForProjects
        ],

        modal: [
            "modalSeed",
            "modals",
            seedRowsForModal
        ],

        homeCards: [
            "homeCardsSeed",
            "cards",
            seedRowsForHomeCards
        ]
    };

    const [
        functionName,
        variableName,
        rowBuilder
    ] =
        definitions[key];

    const rows =
        rowBuilder(
            spec,
            config
        );

    let extraCode = "";

    if (
        key ===
        "pages"
    ) {
        extraCode = [
            "    // HomePage é obrigatória.",
            "    // ContactPage é opcional.",
            "    // Links com categoria usam o ID de project_type."
        ].join(
            "\n"
        );
    }

    if (
        key ===
        "types"
    ) {
        extraCode = [
            "    // project_type.type recebe o slug gerado a partir de type.name.",
            "    // O status controla se o tipo está ativo."
        ].join(
            "\n"
        );
    }

    if (
        key ===
        "homeCards"
    ) {
        extraCode = [
            "    // link_id referencia navbar_links.id.",
            "    // type_id referencia project_type.id."
        ].join(
            "\n"
        );
    }

    const generated =
        renderSeed(
            functionName,
            variableName,
            {
                ...spec,

                modifier:
                    "OR REPLACE"
            },
            rows,
            extraCode
        );

    const targetPath =
        resolved.path ||
        path.join(
            ROOT,
            SEED_CANDIDATES[
            key
            ][0]
        );

    fs.mkdirSync(
        path.dirname(
            targetPath
        ),
        {
            recursive: true
        }
    );

    fs.writeFileSync(
        targetPath,
        generated,
        "utf8"
    );

    return {
        key,

        path:
            getRelative(
                targetPath
            ),

        table:
            spec.table,

        rows:
            rows.length,

        basedOnExistingSchema:
            Boolean(
                resolved.path
            )
    };
}

/*
|--------------------------------------------------------------------------
| NORMALIZAÇÃO
|--------------------------------------------------------------------------
*/

function normalizeConfig(
    config
) {
    const normalized =
        deepMerge(
            clone(
                DEFAULT_CONFIG
            ),
            config
        );

    normalized.version =
        1;

    normalized.metadata = {
        ...(normalized.metadata || {}),

        updatedAt:
            nowIso()
    };

    normalized.navigation =
        ensureIds(
            normalized.navigation,
            "link"
        );

    normalized.types =
        ensureIds(
            normalized.types,
            "tipo"
        );

    normalized.projects =
        ensureIds(
            normalized.projects,
            "projeto"
        );

    normalized.homeCards =
        ensureIds(
            normalized.homeCards,
            "card"
        );

    /*
     * TYPES
     *
     * name = nome legível
     * type = slug automático
     * key  = slug usado internamente
     * slug = compatibilidade
     */
    normalized.types =
        normalized.types.map(
            (type) => {
                const copy = {
                    ...type
                };

                copy.name =
                    normalizeText(
                        copy.name ||
                        copy.type ||
                        ""
                    );

                copy.type =
                    slugify(
                        copy.name
                    );

                copy.key =
                    copy.type;

                copy.slug =
                    copy.type;

                copy.status =
                    copy.status ===
                        undefined
                        ? 1
                        : (
                            Number(
                                copy.status
                            )
                                ? 1
                                : 0
                        );

                return copy;
            }
        );

    /*
     * NAVIGATION
     */
    normalized.navigation =
        normalized.navigation.map(
            (link) => ({
                ...link,

                typeKey:
                    link.typeKey ??
                    "",

                typeId:
                    link.typeId ??
                    null
            })
        );

    /*
     * PROJECTS
     */
    normalized.projects =
        normalized.projects.map(
            (project) => ({
                ...project,

                key:
                    project.key ||
                    slugify(
                        project.title
                    ),

                externalUrl:
                    project.externalUrl ??
                    "",

                status:
                    project.status ===
                        undefined
                        ? 1
                        : (
                            Number(
                                project.status
                            )
                                ? 1
                                : 0
                        ),

                modal:
                    Array.isArray(
                        project.modal
                    )
                        ? project.modal
                        : []
            })
        );

    /*
     * HOME CARDS
     */
    normalized.homeCards =
        normalized.homeCards.map(
            (card) => {
                const linked =
                    normalized.navigation.find(
                        (link) =>
                            Number(
                                link.id
                            ) ===
                            Number(
                                card.linkId
                            )
                    );

                return {
                    ...card,

                    linkId:
                        linked?.id ??
                        null,

                    class:
                        linked
                            ? getHomeCardClass(
                                linked.function
                            )
                            : "",

                    typeKey:
                        linked?.typeKey ??
                        "",

                    typeId:
                        linked?.typeId ??
                        null
                };
            }
        );

    /*
     * OPTIONALS
     */
    normalized.company.occupation =
        normalized.company
            .occupation ??
        "";

    normalized.contacts.address =
        normalized.contacts
            .address ??
        "";

    /*
     * IDS DOS MODAIS
     */
    ensureGlobalModalIds(
        normalized
    );

    return normalized;
}

/*
|--------------------------------------------------------------------------
| VALIDAÇÃO
|--------------------------------------------------------------------------
*/

function validateConfig(
    config
) {
    const errors = [];

    /*
     * NAVIGATION
     */
    if (
        !Array.isArray(
            config.navigation
        )
    ) {
        errors.push(
            "navigation"
        );
    }

    /*
     * TYPES
     */
    if (
        !Array.isArray(
            config.types
        ) ||
        !config.types.length
    ) {
        errors.push(
            "types"
        );
    }

    /*
     * PROJECTS
     */
    if (
        !Array.isArray(
            config.projects
        )
    ) {
        errors.push(
            "projects"
        );
    }

    /*
     * HOME CARDS
     */
    if (
        !Array.isArray(
            config.homeCards
        )
    ) {
        errors.push(
            "homeCards"
        );
    }

    /*
     * TYPE KEYS
     */
    const typeKeys =
        new Set(
            config.types.map(
                (type) =>
                    type.key
            )
        );

    /*
     * TYPE IDS
     */
    const typeIds =
        new Set(
            config.types.map(
                (type) =>
                    Number(
                        type.id
                    )
            )
        );

    /*
     * LINK IDS
     */
    const linkIds =
        new Set(
            config.navigation.map(
                (link) =>
                    Number(
                        link.id
                    )
            )
        );

    /*
     * HOME
     */
    const homeLinks =
        config.navigation.filter(
            (link) =>
                link.function ===
                "HomePage"
        );

    if (
        homeLinks.length !==
        1
    ) {
        errors.push(
            "navigation precisa conter exatamente uma HomePage"
        );
    }

    /*
     * CONTACT
     */
    const contactLinks =
        config.navigation.filter(
            (link) =>
                link.function ===
                "ContactPage"
        );

    if (
        contactLinks.length >
        1
    ) {
        errors.push(
            "navigation pode conter no máximo uma ContactPage"
        );
    }

    /*
     * FUNCTIONS ÚNICAS
     */
    const navigationFunctions =
        new Set();

    /*
     * NAVIGATION
     */
    for (
        const link of
        config.navigation
    ) {
        if (
            !link.label ||
            !link.function ||
            !link.url
        ) {
            errors.push(
                `navigation (${link.id || "sem id"})`
            );
        }

        const functionKey =
            normalizeText(
                link.function
            ).toLowerCase();

        if (
            navigationFunctions.has(
                functionKey
            )
        ) {
            errors.push(
                `navigation.function duplicada (${link.function})`
            );
        }

        navigationFunctions.add(
            functionKey
        );

        /*
         * HomePage
         */
        if (
            link.function ===
            "HomePage"
        ) {
            if (
                link.url !== "/" ||
                link.typeId !== null ||
                link.typeKey !== ""
            ) {
                errors.push(
                    "HomePage precisa usar url='/', type_id=null e typeKey=''"
                );
            }
        }

        /*
         * ContactPage
         */
        if (
            link.function ===
            "ContactPage"
        ) {
            if (
                link.url !==
                "/contato" ||
                link.typeId !== null ||
                link.typeKey !== ""
            ) {
                errors.push(
                    "ContactPage precisa usar url='/contato', type_id=null e typeKey=''"
                );
            }
        }

        /*
         * typeKey
         */
        if (
            link.typeKey &&
            !typeKeys.has(
                link.typeKey
            )
        ) {
            errors.push(
                `navigation.typeKey (${link.label || link.id})`
            );
        }

        /*
         * typeId
         */
        if (
            link.typeId !== null &&
            link.typeId !== undefined
        ) {
            if (
                !typeIds.has(
                    Number(
                        link.typeId
                    )
                )
            ) {
                errors.push(
                    `navigation.typeId (${link.label || link.id})`
                );
            }
        }
    }

    /*
     * TYPES
     */
    const typeSlugs =
        new Set();

    for (
        const type of
        config.types
    ) {
        if (
            !type.name
        ) {
            errors.push(
                `type.name (${type.id || "sem id"})`
            );
        }

        if (
            !type.type
        ) {
            errors.push(
                `type.type (${type.id || "sem id"})`
            );
        }

        if (
            type.type !==
            slugify(
                type.name
            )
        ) {
            errors.push(
                `type.type não corresponde ao slug de type.name (${type.id || type.name})`
            );
        }

        if (
            typeSlugs.has(
                type.type
            )
        ) {
            errors.push(
                `type.type duplicado (${type.type})`
            );
        }

        typeSlugs.add(
            type.type
        );

        if (
            type.status !== 0 &&
            type.status !== 1
        ) {
            errors.push(
                `type.status (${type.type || type.id})`
            );
        }
    }

    /*
     * PROJECTS
     */
    for (
        const project of
        config.projects
    ) {
        if (
            !project.title
        ) {
            errors.push(
                `project.title (${project.key || "sem key"})`
            );
        }

        if (
            !project.typeKey ||
            !typeKeys.has(
                project.typeKey
            )
        ) {
            errors.push(
                `project.typeKey (${project.title || "sem título"})`
            );
        }

        if (
            !Array.isArray(
                project.modal
            )
        ) {
            errors.push(
                `project.modal (${project.title || "sem título"})`
            );
        }

        if (
            project.status !== 0 &&
            project.status !== 1
        ) {
            errors.push(
                `project.status (${project.title || project.id})`
            );
        }
    }

    /*
     * HOME CARDS
     */
    /*
 * HOME CARDS
 */
    for (
        const card of
        config.homeCards
    ) {
        const link =
            config.navigation.find(
                (item) =>
                    Number(
                        item.id
                    ) ===
                    Number(
                        card.linkId
                    )
            );

        /*
         * link_id obrigatório.
         */
        if (
            !link
        ) {
            errors.push(
                `homeCard.linkId (${card.title || "sem título"})`
            );

            continue;
        }

        /*
         * class precisa ser derivada
         * da function do link.
         */
        const expectedClass =
            getHomeCardClass(
                link.function
            );

        if (
            card.class !==
            expectedClass
        ) {
            errors.push(
                `homeCard.class inválida (${card.title || "sem título"}): esperado "${expectedClass}"`
            );
        }

        /*
         * type_id do card precisa
         * ser exatamente o do link.
         */
        if (
            Number(
                card.typeId ??
                -1
            ) !==
            Number(
                link.typeId ??
                -1
            )
        ) {
            errors.push(
                `homeCard.typeId diferente do link (${card.title || "sem título"})`
            );
        }

        /*
         * typeKey também precisa
         * acompanhar o link.
         */
        if (
            (
                card.typeKey ||
                ""
            ) !==
            (
                link.typeKey ||
                ""
            )
        ) {
            errors.push(
                `homeCard.typeKey diferente do link (${card.title || "sem título"})`
            );
        }
    }

    return errors;
}

/*
|--------------------------------------------------------------------------
| VALIDAÇÃO DE PASTAS DOS PROJETOS
|--------------------------------------------------------------------------
*/

function validateProjectFolders(
    config
) {
    const result = {
        skipped:
            false,

        missing:
            [],

        extra:
            [],

        duplicateSlugs:
            []
    };

    if (
        !fs.existsSync(
            PROJECTS_DIR
        )
    ) {
        result.skipped =
            true;

        return result;
    }

    const dirs =
        fs.readdirSync(
            PROJECTS_DIR,
            {
                withFileTypes:
                    true
            }
        )
            .filter(
                (entry) =>
                    entry.isDirectory()
            )
            .map(
                (entry) =>
                    entry.name
            );

    const expected =
        config.projects.map(
            (project) =>
                project.key ||
                slugify(
                    project.title
                )
        );

    const occurrences =
        new Map();

    expected.forEach(
        (slug) => {
            occurrences.set(
                slug,
                (
                    occurrences.get(
                        slug
                    ) ||
                    0
                ) + 1
            );
        }
    );

    result.duplicateSlugs =
        [
            ...occurrences.entries()
        ]
            .filter(
                ([, count]) =>
                    count > 1
            )
            .map(
                ([slug]) =>
                    slug
            );

    result.missing =
        expected.filter(
            (slug) =>
                !dirs.includes(
                    slug
                )
        );

    result.extra =
        dirs.filter(
            (dir) =>
                !expected.includes(
                    dir
                )
        );

    return result;
}

function printProjectValidation(
    validation
) {
    if (
        validation.skipped
    ) {
        console.log(
            "\n⚠ A pasta ./config/projetos não existe. A verificação foi pulada."
        );

        return;
    }

    console.log(
        "\n════════════════════════════════════════"
    );

    console.log(
        "VERIFICAÇÃO DE ./config/projetos"
    );

    console.log(
        "════════════════════════════════════════"
    );

    if (
        !validation.missing.length &&
        !validation.extra.length &&
        !validation.duplicateSlugs.length
    ) {
        console.log(
            "✓ Todos os projetos possuem pasta correspondente."
        );

        return;
    }

    if (
        validation.missing.length
    ) {
        console.log(
            "\n✗ Projetos sem pasta:"
        );

        validation.missing.forEach(
            (slug) =>
                console.log(
                    `  - ${slug}`
                )
        );
    }

    if (
        validation.extra.length
    ) {
        console.log(
            "\n⚠ Pastas sem projeto correspondente:"
        );

        validation.extra.forEach(
            (slug) =>
                console.log(
                    `  - ${slug}`
                )
        );
    }

    if (
        validation.duplicateSlugs.length
    ) {
        console.log(
            "\n✗ Chaves duplicadas no config:"
        );

        validation.duplicateSlugs.forEach(
            (slug) =>
                console.log(
                    `  - ${slug}`
                )
        );
    }
}

/*
|--------------------------------------------------------------------------
| REVISÃO FINAL
|--------------------------------------------------------------------------
*/

async function reviewConfig(
    rl,
    config
) {
    console.log(
        "\n════════════════════════════════════════"
    );

    console.log(
        "RESUMO DA CONFIGURAÇÃO"
    );

    console.log(
        "════════════════════════════════════════"
    );

    console.log(
        `Nome pessoal: ${displayValue(
            config.company.name
        )}`
    );

    console.log(
        `Empresa: ${displayValue(
            config.company.company
        )}`
    );

    console.log(
        `Ocupação: ${displayValue(
            config.company.occupation
        )}`
    );

    console.log(
        `\nNavegação: ${config.navigation.length}`
    );

    for (
        const link of
        config.navigation
    ) {
        console.log(
            `  ${link.id}. ${link.label} → ${link.function} → ${link.url}`
        );
    }

    console.log(
        `\nCategorias: ${config.types.length}`
    );

    for (
        const type of
        config.types
    ) {
        console.log(
            `  ${type.id}. ${type.name} → ${type.type}`
        );
    }

    console.log(
        `\nProjetos: ${config.projects.length}`
    );

    console.log(
        `Cards da Home: ${config.homeCards.length}`
    );

    console.log(
        `Theme: ${config.theme.primary} / ${config.theme.secondary}`
    );

    return confirm(
        rl,
        "A configuração geral está pronta para ser salva e gerar as seeds?"
    );
}

/*
|--------------------------------------------------------------------------
| MAIN
|--------------------------------------------------------------------------
*/

async function main() {
    const rl =
        readline.createInterface({
            input:
                process.stdin,

            output:
                process.stdout
        });

    try {
        console.clear();

        console.log(
            "╔════════════════════════════════════════╗"
        );

        console.log(
            "║       VITRINE DIGITAL — SETUP          ║"
        );

        console.log(
            "╚════════════════════════════════════════╝"
        );

        const existing =
            loadJson();

        let config;

        /*
         * CONFIG EXISTENTE
         */
        if (
            existing
        ) {
            console.log(
                "\n✓ ./config/index.json encontrado."
            );

            const edit =
                await choose(
                    rl,
                    "Deseja editar as informações do sistema?",
                    [
                        {
                            label:
                                "Sim",

                            value:
                                true
                        },

                        {
                            label:
                                "Não",

                            value:
                                false
                        }
                    ]
                );

            if (
                !edit
            ) {
                console.log(
                    "\nNenhuma alteração foi feita."
                );

                return;
            }

            config =
                normalizeConfig(
                    existing
                );
        }

        /*
         * NOVO CONFIG
         */
        else {
            console.log(
                "\nNenhuma configuração encontrada. Vamos criar uma nova."
            );

            config =
                clone(
                    DEFAULT_CONFIG
                );
        }

        /*
         * =========================================================
         * 1 — INFORMAÇÕES
         * =========================================================
         */

        await editCompany(
            rl,
            config
        );

        /*
         * =========================================================
         * 2 — TYPES
         * =========================================================
         */

        await editTypes(
            rl,
            config
        );

        /*
         * =========================================================
         * 3 — NAVBAR / PAGES
         * =========================================================
         */

        await editNavigation(
            rl,
            config
        );

        /*
         * =========================================================
         * 4 — PROJETOS
         * =========================================================
         */

        await editProjects(
            rl,
            config
        );

        /*
         * =========================================================
         * 5 — HOME CARDS
         * =========================================================
         */

        await editHomeCards(
            rl,
            config
        );

        /*
         * =========================================================
         * 6/7 — THEME
         * =========================================================
         */

        await editTheme(
            rl,
            config
        );

        /*
         * NORMALIZA NOVAMENTE
         */
        config =
            normalizeConfig(
                config
            );

        /*
         * VALIDATION
         */
        const errors =
            validateConfig(
                config
            );

        if (
            errors.length
        ) {
            console.log(
                "\n✗ Foram encontrados problemas:"
            );

            errors.forEach(
                (error) =>
                    console.log(
                        `  - ${error}`
                    )
            );

            throw new Error(
                "A configuração possui campos inválidos. Nenhuma seed foi reescrita."
            );
        }

        /*
         * REVIEW
         */
        const approved =
            await reviewConfig(
                rl,
                config
            );

        if (
            !approved
        ) {
            console.log(
                "\nOperação cancelada. Nenhuma alteração foi salva."
            );

            return;
        }

        /*
         * SAVE
         */
        saveJson(
            config
        );

        console.log(
            `\n✓ Configuração salva em ${getRelative(
                CONFIG_FILE
            )}`
        );

        /*
         * PROJECT FOLDERS
         */
        const validation =
            validateProjectFolders(
                config
            );

        printProjectValidation(
            validation
        );

        const hasAnomaly =
            validation.missing.length ||
            validation.extra.length ||
            validation.duplicateSlugs.length;

        const continueAfterCheck =
            await confirm(
                rl,
                validation.skipped ||
                    !hasAnomaly
                    ? "Deseja gerar/regravar as seeds do backend?"
                    : "Existem anomalias nos projetos. Deseja continuar mesmo assim e gerar as seeds?"
            );

        if (
            !continueAfterCheck
        ) {
            console.log(
                "\nConfiguração salva, mas as seeds não foram reescritas."
            );

            return;
        }

        /*
         * =========================================================
         * SEEDS
         * =========================================================
         */

        const seedOrder = [
            "infos",
            "types",
            "pages",
            "projects",
            "modal",
            "homeCards"
        ];

        console.log(
            "\n════════════════════════════════════════"
        );

        console.log(
            "GERANDO SEEDS"
        );

        console.log(
            "════════════════════════════════════════"
        );

        for (
            const key of
            seedOrder
        ) {
            const result =
                writeSeed(
                    key,
                    config
                );

            const sourceMark =
                result.basedOnExistingSchema
                    ? "schema existente"
                    : "schema padrão";

            console.log(
                `✓ ${result.path} — ${result.rows} registros (${sourceMark})`
            );
        }

        /*
         * FINAL
         */
        console.log(
            "\n════════════════════════════════════════"
        );

        console.log(
            "SETUP CONCLUÍDO"
        );

        console.log(
            "════════════════════════════════════════"
        );

        console.log(
            "✓ config/index.json atualizado"
        );

        console.log(
            "✓ infosSeed atualizado"
        );

        console.log(
            "✓ typesSeed atualizado com slug automático em project_type.type"
        );

        console.log(
            "✓ pagesSeed atualizado com HomePage obrigatória e ContactPage opcional"
        );

        console.log(
            "✓ projectsSeed atualizado com type_id"
        );

        console.log(
            "✓ modalSeed atualizado com IDs automáticos"
        );

        console.log(
            "✓ homeCardsSeed atualizado com link_id/type_id"
        );

        console.log(
            "✓ IDs primários gerados automaticamente"
        );

        console.log(
            "✓ theme salvo para uso futuro"
        );

        console.log(
            "✓ Verificação de ./config/projetos concluída"
        );

        console.log(
            "\nO processamento/organização das imagens permanece para o próximo programa."
        );
    }

    catch (error) {
        console.error(
            `\n✗ ${error.message}`
        );

        process.exitCode =
            1;
    }

    finally {
        rl.close();
    }
}

main();