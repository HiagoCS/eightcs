const { sqlite } = require("../index");

function infosSeed(){
    const insert = sqlite.prepare(`INSERT OR REPLACE INTO infos(id, name, occupation, company, email, phone, whatsapp, location, description, footer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    const infos = [
        [
        1,
        "",
        "Marmoraria",
        "Star Leme Marmoraria",
        "starleme.marmoraria@example.com",
        "(11) 99999-0000",
        "13999990000",
        "São Paulo, SP e Grande São Paulo",
        "Soluções em pedras naturais e superfícies para projetos residenciais, com fabricação sob medida, acabamento preciso e instalação pensada para valorizar cada ambiente.",
        "Elegância, precisão e qualidade em cada detalhe do seu projeto."
]
    ];

    infos.map((data) => {
        insert.run(...data);
    });
}

module.exports = { infosSeed };
