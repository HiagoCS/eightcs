const { sqlite } = require("../../index");

function homeCardsSeed(){
    const insert = sqlite.prepare(`INSERT OR REPLACE INTO home_cards(id, title, text, class, icon, link_id, type_id) VALUES (?, ?, ?, ?, ?, ?, ?)`);

    const cards = [
        [
        1,
        "Projetos",
        "Conheça projetos residenciais desenvolvidos com pedras e superfícies sob medida para cada ambiente.",
        "projetos",
        "projects",
        3,
        1
],
        [
        2,
        "Materiais",
        "Conheça as opções de pedras naturais e superfícies disponíveis para transformar seu projeto.",
        "materiais",
        "materials",
        4,
        2
],
        [
        3,
        "Contatos",
        "Entre em contato com a Star Leme Marmoraria para tirar dúvidas e conhecer nossos serviços.",
        "contact",
        "contact",
        2,
        null
],
        [
        4,
        "Solicite um Orçamento",
        "Envie as informações do seu projeto e consulte as possibilidades para seu ambiente.",
        "orcamento",
        "form",
        5,
        null
]
    ];

    cards.map((data) => {
        insert.run(...data);
    });

    // link_id referencia navbar_links.id.
    // type_id referencia project_type.id.
}

module.exports = { homeCardsSeed };
