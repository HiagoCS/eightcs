const { sqlite } = require("../index");

function infosSeed(){
    const insert = sqlite.prepare(`INSERT OR IGNORE INTO infos(id, name, occupation, company, email, phone, whatsapp, location, description, footer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    insert.run(
        1,
        "Glauber Silva de Jesus",
        "Oficina Mecânica",
        "GlauGrau Motopeças",
        "contatoglaugrau@gmail.com",
        "(11)9 5761-3439",
        "11957613439",
        "Rua do Manifesto, 2262, Ipiranga, SP",
        "Oferecemos uma ampla variedade de peças para sua moto, com qualidade, praticidade e tudo o que você precisa para manter sua moto sempre pronta para a estrada.",
        "Tudo para sua moto, com qualidade, confiança e praticidade em cada escolha."
    );
}
module.exports = {infosSeed}