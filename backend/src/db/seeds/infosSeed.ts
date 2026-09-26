const { sqlite } = require("../index");

function infosSeed(){
    const insert = sqlite.prepare(`INSERT OR IGNORE INTO infos(id, name, occupation, company, email, phone, whatsapp, location, description, footer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

    insert.run(
        1,
        "Hiago Costa Santos",
        "Desenvolvedor Full-Stack",
        "eight.cs development",
        "contato8cs@gmail.com",
        "(11) 9 5826-7059",
        "11958267059",
        "São Paulo, SP",
        "Desenvolvedor Full-Stack formado em Análise e Desenvolvimento de Sistemas.",
        "Transformando ideias em soluções digitais, criativas, eficientes e de impacto."
    );
}
module.exports = {infosSeed}