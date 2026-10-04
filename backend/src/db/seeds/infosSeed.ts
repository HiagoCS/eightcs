const { sqlite } = require("../index");

function infosSeed(){
    const insert = sqlite.prepare(`INSERT OR REPLACE INTO infos(id, name, occupation, company, email, phone, whatsapp, location, description, footer, banner_top, banner) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    const infos = [
        [
        1,
        "Regiane Costa Soares",
        "Contabilidade Consultiva",
        "",
        "regiane.c.soares@hotmail.com",
        "13 99622-5800",
        "13996225800",
        "Atendimento presencial e online — Peruíbe/SP",
        "Serviços contábeis para pessoas e empresas, com atendimento personalizado, orientação fiscal e apoio na organização financeira e tributária.",
        "Contabilidade com clareza, organização e confiança para cuidar das suas obrigações.",
        "Mais que números, o crescimento do seu negócio.",
        "Sua contabilidade, mais simples e estratégica."
]
    ];

    infos.map((data) => {
        insert.run(...data);
    });
}

module.exports = { infosSeed };
