const { sqlite } = require("../../index");

function pagesSeed(){
    const insert = sqlite.prepare(`INSERT OR REPLACE INTO navbar_links(id, label, function, url, type_id) VALUES (?, ?, ?, ?, ?)`);

    const pages = [
        [
        1,
        "Ínicio",
        "HomePage",
        "/",
        null
],
        [
        3,
        "Projetos",
        "ProjetosPage",
        "/marmoraria/projetos",
        1
],
        [
        4,
        "Materiais",
        "MateriaisPage",
        "/marmoraria/materiais",
        2
],
        [
        5,
        "Orçamento",
        "OrcamentoPage",
        "/orcamento",
        null
],
        [
        2,
        "Contatos",
        "ContactPage",
        "/contato",
        null
]
    ];

    pages.map((data) => {
        insert.run(...data);
    });

    // HomePage é obrigatória.
    // ContactPage é opcional.
    // Links com categoria usam o ID de project_type.
}

module.exports = { pagesSeed };
