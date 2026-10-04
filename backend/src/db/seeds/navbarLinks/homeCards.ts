const { sqlite } = require("../../index");

function homeCardsSeed(){
    const insert = sqlite.prepare(`INSERT OR REPLACE INTO home_cards(id, title, text, class, icon, link_id, type_id) VALUES (?, ?, ?, ?, ?, ?, ?)`);

    const cards = [
        [
        1,
        "Serviços",
        "Conheça nossos serviços de gesso, drywall e acabamentos em geral para valorizar e transformar diferentes ambientes.",
        "servicos",
        "services",
        3,
        1
],
        [
        2,
        "Residencial",
        "Veja projetos de pintura realizados em ambientes residenciais, com diferentes estilos, cores e acabamentos.",
        "residencial",
        "residencial",
        4,
        2
],
        [
        3,
        "Predial",
        "Confira trabalhos de pintura e revitalização realizados em fachadas, áreas comuns e espaços prediais.",
        "predial",
        "predial",
        5,
        3
],
        [
        4,
        "Contato",
        "Entre em contato com a J.M Pinturas e Acabamentos para tirar dúvidas e conhecer nossos serviços.",
        "contact",
        "about",
        2,
        null
],
        [
        5,
        "Orçamento",
        "Solicite um orçamento para seu projeto e conte com a J.M Pinturas e Acabamentos.",
        "orcamento",
        "form",
        6,
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
