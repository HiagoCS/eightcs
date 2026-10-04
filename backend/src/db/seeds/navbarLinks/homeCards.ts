const { sqlite } = require("../../index");

function homeCardsSeed(){
    const insert = sqlite.prepare(`INSERT OR REPLACE INTO home_cards(id, title, text, class, icon, link_id, type_id) VALUES (?, ?, ?, ?, ?, ?, ?)`);

    const cards = [
        [
        1,
        "Serviços Contábeis",
        "Soluções contábeis para pessoas físicas, MEIs, autônomos e pequenos negócios.",
        "contabilidade",
        "contabilidade",
        5,
        1
],
        [
        2,
        "Declarações",
        "Auxílio na organização das informações e preparação de declarações para manter suas obrigações em dia.",
        "declaracoes",
        "declaracoes",
        6,
        2
],
        [
        3,
        "Consultoria",
        "Orientação personalizada para esclarecer dúvidas e organizar melhor sua rotina contábil e financeira.",
        "consultoria",
        "consultoria",
        7,
        3
],
        [
        4,
        "Entre em Contato",
        "Tire suas dúvidas e encontre o serviço mais adequado para sua necessidade.",
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
