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
        2,
        "Empresa",
        "CompanyPage",
        "/sobre",
        null
],
        [
        4,
        "Portfólio",
        "PortfolioPage",
        "/projetos",
        1
],
        [
        5,
        "Clientes",
        "ClientesPage",
        "/sobre/clientes",
        2
],
        [
        3,
        "Contato",
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
