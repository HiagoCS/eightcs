const { sqlite } = require("../../index");

function homeCardsSeed(){
    const insert = sqlite.prepare(`
        INSERT OR IGNORE INTO home_cards
        (id, title, text, class, icon, link_id, type_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const cards = [
        [
            1,
            "Acessórios",
            "Encontre acessórios para equipar, personalizar e tornar sua moto ainda mais prática para o dia a dia.",
            "accessories",
            "Accessories",
            2,
            1
        ],
        [
            2,
            "Manutenção",
            "Peças e componentes para manter sua moto em boas condições e pronta para a estrada.",
            "maintenance",
            "Maintenance",
            3,
            2
        ],
        [
            3,
            "Encomendas",
            "Não encontrou o que procura? Consulte nossa equipe e verifique a disponibilidade de peças sob encomenda.",
            "orders",
            "Orders",
            4,
            3
        ],
        [
            4,
            "Contato",
            "Precisa de uma peça ou quer consultar nossa disponibilidade? Entre em contato com nossa equipe.",
            "contact",
            "Contact",
            5,
            null
        ]
    ];

    cards.map((data) => {
        insert.run(...data);
    });
}

module.exports = { homeCardsSeed };