const { sqlite } = require("../index");

function infosSeed(){
    const insert = sqlite.prepare(`INSERT OR REPLACE INTO infos(id, name, occupation, company, email, phone, whatsapp, location, description, footer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    const infos = [
        [
        1,
        "",
        "Pinturas e Acabamentos",
        "J.M Pinturas e Acabamentos",
        "contatojmpinturas@gmail.com",
        "11 9 9744-8269",
        "11997448269",
        "São Paulo e Grande SP",
        "Pintura sem dor de cabeça. Equipe própria, prazo cumprido, imóvel limpo.",
        "Equipe própria, uniformizada e sob supervisão. Se não ficar bom na vistoria, voltamos sem custo."
]
    ];

    infos.map((data) => {
        insert.run(...data);
    });
}

module.exports = { infosSeed };
