#!/usr/bin/env node

/**
 * Vitrine Digital - Configurador
 *
 * Execute na raiz do projeto:
 *
 *     npm run setup
 *
 * Este arquivo não possui dependências externas.
 *
 * O arquivo:
 *
 *     ./config/index.json
 *
 * é a fonte de configuração da Vitrine Digital.
 *
 * Ordem das dependências:
 *
 * 1. Informações / Contatos
 * 2. Types
 * 3. Navbar / Pages
 * 4. Projetos / Serviços
 * 5. Modais
 * 6. Home Cards
 * 7. Theme
 *
 * Dependências:
 *
 * Types
 *   ├── navbar_links.type_id
 *   └── project.type_id
 *
 * Navbar + Types
 *   └── home_cards.link_id / type_id
 *
 * Projetos
 *   └── modal.project_id
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

    /*
     * Os links são configuráveis novamente.
     *
     * HomePage e ContactPage normalmente possuem
     * type_id = null.
     */
    navigation: [],

    /*
     * Categorias que alimentam project_type.
     */
    types: [],

    /*
     * Projetos / serviços.
     */
    projects: [],

    /*
     * Cards da Home.
     */
    homeCards: [],

    /*
     * Theme ainda não participa de nenhuma seed.
     *
     * É salvo no config para utilização futura.
     */
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
        "backend/src/db/seeds/navbarLinks/pages.ts",
    ],

    types: [
        "backend/src/db/seeds/projects/types.ts",
    ],

    projects: [
        "backend/src/db/seeds/projects/projects.ts",
    ],

    modal: [
        "backend/src/db/seeds/projects/modal.ts",
    ],

    homeCards: [
        "backend/src/db/seeds/navbarLinks/homeCards.ts",
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

function nowIso() {
    return new Date()
        .toISOString();
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
    return JSON
        .stringify(
            value,
            null,
            8
        )
        .replace(
            /^( {8})/gm,
            "        "
        );
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
        Array.isArray(base)
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
| ARQUIVO DE CONFIGURAÇÃO
|--------------------------------------------------------------------------
*/

function saveJson(config) {
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
    } catch (error) {
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

/**
 * Descobre:
 *
 * INSERT OR IGNORE INTO tabela
 * (colunas)
 * VALUES (?, ?)
 */
function extractInsertSpec(
    seedPath
) {
    if (
        !seedPath ||
        !fs.existsSync(seedPath)
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
            table: "infos",

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
            .map(() => "?")
            .join(", ");

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
            : ""
        }}

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

/**
 * Exibe valor vazio como "(vazio)".
 */
function displayValue(
    value
) {
    return value === ""
        ? "(vazio)"
        : String(value);
}

/*
|--------------------------------------------------------------------------
| RESPOSTAS
|--------------------------------------------------------------------------
*/

/**
 * Required:
 *
 * Enter + original válido
 *     -> usa original
 *
 * Enter + sem original
 *     -> continua perguntando
 *
 * Valor preenchido
 *     -> confirma
 *
 * A confirmação sempre exibe
 * "(vazio)" quando necessário.
 */
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

        /**
         * ENTER
         */
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

/**
 * Optional:
 *
 * Enter + original válido
 *     -> usa original
 *
 * Enter + original vazio
 *     -> confirma "(vazio)" e registra ""
 *
 * Enter + sem original
 *     -> confirma "(vazio)" e registra ""
 *
 * Valor preenchido
 *     -> confirma
 */
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

        /**
         * ENTER
         */
        if (!answer) {
            const hasOriginal =
                original !== undefined &&
                original !== null &&
                normalizeText(
                    original
                ) !== "";

            /**
             * Se existe original:
             * usa o original.
             */
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

            /**
             * Sem original:
             * registra realmente "".
             *
             * Na tela:
             * "(vazio)"
             */
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

/*
|--------------------------------------------------------------------------
| CONFIRMAÇÕES
|--------------------------------------------------------------------------
*/

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

        /**
         * Theme pode manter o valor atual
         * com Enter.
         */
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
| IDS
|--------------------------------------------------------------------------
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

    const seen =
        new Set();

    let nextId = 1;

    return items.map(
        (item) => {
            const copy = {
                ...item
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
                while (
                    seen.has(
                        nextId
                    )
                ) {
                    nextId++;
                }

                id =
                    nextId++;
            }

            seen.add(
                id
            );

            copy.id =
                id;

            if (
                !copy.key
            ) {
                copy.key =
                    slugify(
                        copy.title ||
                        copy.label ||
                        copy.type ||
                        `${prefix}-${id}`
                    );
            }

            return copy;
        }
    );
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

    normalized.version = 1;

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
     * Compatibilidade com versões antigas
     * que utilizavam "name".
     */
    normalized.types =
        normalized.types.map(
            (type) => {
                const copy = {
                    ...type
                };

                copy.type =
                    copy.type ||
                    copy.name ||
                    "";

                copy.name =
                    copy.type;

                copy.key =
                    copy.key ||
                    copy.slug ||
                    slugify(
                        copy.type
                    );

                copy.slug =
                    copy.slug ||
                    copy.key;

                copy.status =
                    copy.status === undefined
                        ? 1
                        : copy.status;

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
                    project.status === undefined
                        ? 1
                        : project.status,

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
            (card) => ({
                ...card,

                linkId:
                    card.linkId ??
                    null,

                typeKey:
                    card.typeKey ??
                    ""
            })
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

    return normalized;
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
| 1. INFORMAÇÕES / CONTATOS
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
| 2. TYPES
|--------------------------------------------------------------------------
*/

async function createTypeItem(
    rl,
    current = null
) {
    const item =
        current
            ? { ...current }
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
        Number(
            await askRequired(
                rl,
                "ID numérico da categoria",
                current?.id
            )
        ) || 0;

    item.type =
        await askRequired(
            rl,
            "Nome do tipo / categoria",
            current?.type ||
            current?.name
        );

    item.key =
        await askRequired(
            rl,
            "Chave da categoria",
            current?.key ||
            current?.slug ||
            slugify(
                item.type
            )
        );

    item.slug =
        item.key;

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

    /*
     * Compatibilidade interna.
     *
     * A coluna do banco continua sendo "type".
     */
    item.name =
        item.type;

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
            createTypeItem,

            (item) => {
                console.log(
                    `${item.id}. ${item.type}`
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
}

/*
|--------------------------------------------------------------------------
| 3. NAVBAR / PAGES
|--------------------------------------------------------------------------
*/

async function createNavigationItem(
    rl,
    current = null,
    config
) {
    const item =
        current
            ? { ...current }
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
        Number(
            await askRequired(
                rl,
                "ID numérico do link",
                current?.id
            )
        ) || 0;

    item.label =
        await askRequired(
            rl,
            "Texto exibido no menu",
            current?.label
        );

    item.function =
        await askRequired(
            rl,
            "Função/página React",
            current?.function
        );

    item.url =
        await askRequired(
            rl,
            "URL/rota",
            current?.url
        );

    /*
     * HomePage e ContactPage
     * não precisam de type_id.
     */
    if (
        item.function ===
        "HomePage" ||
        item.function ===
        "ContactPage"
    ) {
        item.typeKey =
            "";

        item.typeId =
            null;

        const accepted =
            await confirm(
                rl,
                `${item.function} ficará com type_id = null.`
            );

        if (
            !accepted
        ) {
            return createNavigationItem(
                rl,
                null,
                config
            );
        }

        return item;
    }

    /*
     * Os demais links podem possuir
     * type_id nulo, mas normalmente
     * precisam de categoria para buscar
     * os projetos correspondentes.
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
                    `${type.id} — ${type.type}`,

                value: {
                    typeKey:
                        type.key,

                    typeId:
                        type.id
                }
            })
        )
    ];

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

    return item;
}

async function editNavigation(
    rl,
    config
) {
    config.navigation =
        await editCollection(
            rl,
            "4/7 — NAVBAR / PAGES",
            config.navigation,

            (currentRl, current) =>
                createNavigationItem(
                    currentRl,
                    current,
                    config
                ),

            (item) => {
                console.log(
                    `${item.id}. ${item.label} → ${item.url}`
                );

                console.log(
                    `   função: ${item.function}`
                );

                console.log(
                    `   type_id: ${item.typeId ??
                    "null"
                    }`
                );
            }
        );
}

/*
|--------------------------------------------------------------------------
| 4. PROJETOS / SERVIÇOS
|--------------------------------------------------------------------------
*/

async function createModalItem(
    rl,
    current = null
) {
    const item =
        current
            ? { ...current }
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

    item.id =
        Number(
            await askRequired(
                rl,
                "ID numérico do projeto/serviço",
                current?.id
            )
        ) || 0;

    item.title =
        await askRequired(
            rl,
            "Título do projeto/serviço",
            current?.title
        );

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
                        `${type.id} — ${type.type}`,

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

                (modal, index) => {
                    console.log(
                        `${index + 1}. ${modal.text}`
                    );

                    console.log(
                        `   extensão: ${modal.extension}`
                    );
                }
            );

        item.modal =
            item.modal.map(
                (
                    modal,
                    index
                ) => ({
                    ...modal,

                    id:
                        Number(
                            modal.id
                        ) > 0
                            ? Number(
                                modal.id
                            )
                            : index + 1
                })
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

            (currentRl, current) =>
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
}

/*
|--------------------------------------------------------------------------
| 5. HOME CARDS
|--------------------------------------------------------------------------
*/

async function createHomeCardItem(
    rl,
    current = null,
    config
) {
    const item =
        current
            ? { ...current }
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
                    ""
            };

    item.id =
        Number(
            await askRequired(
                rl,
                "ID do card",
                current?.id
            )
        ) || 0;

    item.title =
        await askRequired(
            rl,
            "Título do card",
            current?.title
        );

    item.text =
        await askRequired(
            rl,
            "Texto do card",
            current?.text
        );

    item.class =
        await askRequired(
            rl,
            "Classe CSS",
            current?.class
        );

    item.icon =
        await askRequired(
            rl,
            "Nome do ícone",
            current?.icon
        );

    /*
     * O link_id precisa apontar
     * diretamente para navbar_links.id.
     *
     * Por isso esta etapa só acontece
     * depois de navigation.
     */
    const linkOptions = [
        {
            label:
                "Sem link / link_id = null",

            value:
                null
        },

        ...config.navigation.map(
            (link) => ({
                label:
                    `${link.id} — ${link.label} (${link.function})`,

                value:
                    link.id
            })
        )
    ];

    item.linkId =
        await choose(
            rl,
            "Link do card (referência para navbar_links):",
            linkOptions
        );

    /*
     * type_id do próprio card.
     */
    const typeOptions = [
        {
            label:
                "Sem categoria / type_id = null",

            value:
                ""
        },

        ...config.types.map(
            (type) => ({
                label:
                    `${type.id} — ${type.type}`,

                value:
                    type.key
            })
        )
    ];

    item.typeKey =
        await choose(
            rl,
            "Categoria do card (type_id):",
            typeOptions
        );

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

            (currentRl, current) =>
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
                    `   link_id: ${item.linkId ??
                    "null"
                    }`
                );

                console.log(
                    `   type_id: ${item.typeKey ||
                    "null"
                    }`
                );
            }
        );
}

/*
|--------------------------------------------------------------------------
| 6. THEME
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

    const result = [];

    /*
     * Primeiro editamos os itens existentes.
     */
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
         * MANter
         */
        if (
            action ===
            "keep"
        ) {
            result.push(
                item
            );

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
                result.push(
                    item
                );
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
     * Novos itens.
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
     * Primeiro tenta correspondência
     * direta.
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

        /*
         * Banco usa location.
         */
        location: [
            "location",
            "address"
        ],

        /*
         * Mantemos address como
         * compatibilidade.
         */
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

        /*
         * Banco usa "type".
         */
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
        aliases[key] || []
    ) {
        if (
            context[alias] !==
            undefined
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

    /*
     * Algumas versões da tabela
     * podem utilizar key/value.
     */
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
                config.company
                    .name
            ],

            [
                "company",
                config.company
                    .company
            ],

            [
                "occupation",
                config.company
                    .occupation
            ],

            [
                "description",
                config.company
                    .description
            ],

            [
                "footer",
                config.company
                    .footer
            ],

            [
                "email",
                config.contacts
                    .email
            ],

            [
                "phone",
                config.contacts
                    .phone
            ],

            [
                "whatsapp",
                config.contacts
                    .whatsapp
            ],

            [
                "location",
                config.contacts
                    .address
            ]
        ].filter(
            ([, value]) =>
                value !==
                undefined &&
                value !==
                null &&
                value !==
                ""
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

    /*
     * Estrutura normal.
     */
    return [
        buildRow(
            spec.columns,
            {
                id:
                    1,

                company:
                    config.company
                        .company,

                name:
                    config.company
                        .name,

                occupation:
                    config.company
                        .occupation,

                description:
                    config.company
                        .description,

                footer:
                    config.company
                        .footer,

                email:
                    config.contacts
                        .email,

                phone:
                    config.contacts
                        .phone,

                whatsapp:
                    config.contacts
                        .whatsapp,

                location:
                    config.contacts
                        .address,

                address:
                    config.contacts
                        .address
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
                     * COLUNA REAL:
                     * project_type.type
                     */
                    type:
                        type.type.toLowerCase(),

                    name:
                        type.type.toLowerCase(),

                    typeName:
                        type.type.toLowerCase(),

                    key:
                        type.key,

                    slug:
                        type.slug.toLowerCase(),

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

    let fallbackId = 1;

    for (
        const project of
        config.projects
    ) {
        for (
            const modal of
            project.modal || []
        ) {
            rows.push(
                buildRow(
                    spec.columns,
                    {
                        id:
                            fallbackId++,

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
            const type =
                config.types.find(
                    (item) =>
                        item.key ===
                        card.typeKey
                );

            return buildRow(
                spec.columns,
                {
                    id:
                        card.id,

                    title:
                        card.title,

                    text:
                        card.text,

                    class:
                        card.class,

                    icon:
                        card.icon,

                    /*
                     * FK -> navbar_links.id
                     */
                    linkId:
                        card.linkId ??
                        null,

                    /*
                     * FK -> project_type.id
                     */
                    typeId:
                        type?.id ??
                        null,

                    typeKey:
                        card.typeKey ||
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
            "    // HomePage e ContactPage podem possuir type_id = null.",
            "    // Links associados a categorias usam o ID de project_type."
        ].join(
            "\n"
        );
    }

    if (
        key ===
        "types"
    ) {
        extraCode = [
            "    // A coluna do banco é project_type.type.",
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

                /*
                 * O configurador precisa atualizar
                 * os registros existentes.
                 */
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
| VALIDAÇÃO DA CONFIGURAÇÃO
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
     * CHAVES DOS TYPES
     */
    const typeKeys =
        new Set(
            config.types.map(
                (type) =>
                    type.key
            )
        );

    /*
     * IDS DA NAVBAR
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
     * VALIDA NAVBAR
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
         * Se typeId estiver preenchido,
         * precisa ser válido.
         */
        if (
            link.typeId !== null &&
            link.typeId !== undefined
        ) {
            const matchingType =
                config.types.find(
                    (type) =>
                        Number(
                            type.id
                        ) ===
                        Number(
                            link.typeId
                        )
                );

            if (
                !matchingType
            ) {
                errors.push(
                    `navigation.typeId (${link.label || link.id})`
                );
            }
        }
    }

    /*
     * VALIDA TYPES
     */
    for (
        const type of
        config.types
    ) {
        if (
            !type.type
        ) {
            errors.push(
                `type.type (${type.id || "sem id"})`
            );
        }

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
     * VALIDA PROJETOS
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
    }

    /*
     * VALIDA HOME CARDS
     */
    for (
        const card of
        config.homeCards
    ) {
        if (
            card.linkId !== null &&
            card.linkId !== undefined
        ) {
            if (
                !linkIds.has(
                    Number(
                        card.linkId
                    )
                )
            ) {
                errors.push(
                    `homeCard.linkId (${card.title || "sem título"})`
                );
            }
        }

        if (
            card.typeKey &&
            !typeKeys.has(
                card.typeKey
            )
        ) {
            errors.push(
                `homeCard.typeKey (${card.title || "sem título"})`
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
        `Categorias: ${config.types.length}`
    );

    console.log(
        `Links: ${config.navigation.length}`
    );

    console.log(
        `Projetos: ${config.projects.length}`
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
         *
         * Nenhuma entidade posterior é processada
         * antes que os types existam.
         * =========================================================
         */

        await editTypes(
            rl,
            config
        );

        /*
         * =========================================================
         * 3 — NAVBAR
         *
         * Agora já existem type_id disponíveis.
         * =========================================================
         */

        await editNavigation(
            rl,
            config
        );

        /*
         * =========================================================
         * 4 — PROJETOS
         *
         * Agora os projetos podem escolher type_id.
         * =========================================================
         */

        await editProjects(
            rl,
            config
        );

        /*
         * =========================================================
         * 5 — HOME CARDS
         *
         * Agora já existem:
         *
         * - types
         * - navbar_links
         *
         * então podemos registrar:
         *
         * - type_id
         * - link_id
         * =========================================================
         */

        await editHomeCards(
            rl,
            config
        );

        /*
         * =========================================================
         * 6/7 — THEME
         *
         * Theme permanece como último tópico.
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
         * =========================================================
         * VALIDAÇÃO
         * =========================================================
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
         * =========================================================
         * REVISÃO
         * =========================================================
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
         * =========================================================
         * SALVA CONFIG
         * =========================================================
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
         * =========================================================
         * VERIFICA PROJETOS
         * =========================================================
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
         * =========================================================
         * FINAL
         * =========================================================
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
            "✓ typesSeed atualizado com type/status"
        );

        console.log(
            "✓ pagesSeed atualizado com type_id"
        );

        console.log(
            "✓ projectsSeed atualizado com type_id"
        );

        console.log(
            "✓ modalSeed atualizado"
        );

        console.log(
            "✓ homeCardsSeed atualizado com link_id/type_id"
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