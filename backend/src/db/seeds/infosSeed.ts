const { sqlite } = require("../index");

function infosSeed(){
    const insert = sqlite.prepare(`INSERT OR REPLACE INTO infos(id, name, occupation, company, email, phone, whatsapp, location, description, footer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    const infos = [
        [
        1,
        "",
        "Empreiteira",
        "Empreiteira Glass",
        "contatoglass@gmail.com",
        "11 94911-2241",
        "11949112241",
        "São Paulo, SP",
        "Realizamos serviços de Sacadas e Envidraçamento, Pintura e Reformas em Geral, atendendo às necessidades de residências, comércios e outros espaços que buscam mais conforto, segurança, funcionalidade e valorização do ambiente.",
        "Nosso trabalho é baseado na atenção aos detalhes, na qualidade dos serviços e no compromisso com cada cliente, buscando entregar resultados que unam bom acabamento, eficiência e satisfação em todas as etapas do projeto."
]
    ];

    infos.map((data) => {
        insert.run(...data);
    });
}

module.exports = { infosSeed };
