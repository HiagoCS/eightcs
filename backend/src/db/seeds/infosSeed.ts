const { sqlite } = require("../index");

function infosSeed(){
    const insert = sqlite.prepare(`INSERT OR REPLACE INTO infos(id, name, occupation, company, email, phone, whatsapp, location, description, footer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    const infos = [
        [
        1,
        "Hiago Costa Santos",
        "Desenvolvimento Full-Stack",
        "eight.cs development",
        "hiago8cs@gmail.com",
        "(11) 9 5826-7059",
        "11958267059",
        "São Paulo, SP",
        "Desenvolvedor Full-Stack formado em Análise e Desenvolvimento de Sistemas.",
        "Transformando ideias em soluções digitais, criativas, eficientes e de impacto."
]
    ];

    infos.map((data) => {
        insert.run(...data);
    });
}

module.exports = { infosSeed };
