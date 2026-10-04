const { sqlite } = require("../../index");

function homeCardsSeed(){
    const insert = sqlite.prepare(`INSERT OR REPLACE INTO home_cards(id, title, text, class, icon, link_id, type_id) VALUES (?, ?, ?, ?, ?, ?, ?)`);

    const cards = [
        [
        1,
        "Empresa",
        "Conheça a Empreiteira Glass e descubra nossa experiência e compromisso com a qualidade na construção civil.",
        "about-page",
        "about",
        2,
        null
],
        [
        2,
        "Portfólio",
        "Confira alguns dos projetos realizados pela Empreiteira Glass em sacadas, envidraçamento, pintura e reformas.",
        "portfolio",
        "portfolio",
        4,
        1
],
        [
        3,
        "Clientes",
        "Veja alguns dos clientes atendidos e projetos realizados pela Empreiteira Glass.",
        "clientes",
        "clients",
        5,
        2
],
        [
        4,
        "Contato",
        "Entre em contato com a Empreiteira Glass e solicite um orçamento para o seu projeto.",
        "contact",
        "contact",
        3,
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
