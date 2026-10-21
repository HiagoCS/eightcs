const { sqlite } = require("../../index");

function homeCardsSeed(){
    const insert = sqlite.prepare(`INSERT OR REPLACE INTO home_cards(id, title, text, class, icon, link_id, type_id) VALUES (?, ?, ?, ?, ?, ?, ?)`);

    const cards = [
        [
        1,
        "Web",
        "Aplicações modernas, responsivas e otimizadas para entregar a melhor experiência na web.",
        "web",
        "Web",
        3,
        1
],
        [
        2,
        "Mobile",
        "Apps para IOS e Android com foco em performance, usabilidade e design moderno.",
        "mobile",
        "Mobile",
        5,
        3
],
        [
        3,
        "Desktop",
        "Soluções desktop utilizando tecnologias modernas e frameworks populares para atender às necessidades do usuário.",
        "desktop",
        "Desktop",
        4,
        2
],
        [
        4,
        "Contato",
        "Gostou da plataforma, entre em contato comigo para que possamos conversar sobre o seu projeto.",
        "contact",
        "Contact",
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
