const { sqlite } = require("../index");

function infosSeed(){
    const insert = sqlite.prepare(`INSERT OR IGNORE INTO infos(id, name, occupation, company, email, phone, location, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);

    insert.run(
        1,
        "Hiago Costa Santos",
        "Desenvolvedor Full-Stack",
        "eight.cs development",
        "contato8cs@gmail.com",
        "(11) 9 5826-7059",
        "São Paulo, SP",
        "Desenvolvedor Full-Stack formado em Análise e Desenvolvimento de Sistemas."
    );
}
module.exports = {infosSeed}