const { sqlite } = require("../index");

function infosSeed(){
    const insert = sqlite.prepare(`INSERT OR IGNORE INTO infos(id, name, email, phone, location) VALUES (?, ?, ?, ?, ?)`);

    insert.run(
        1,
        "Hiago Costa Santos",
        "contato8cs@gmail.com",
        "(11) 9 5826-7059",
        "São Paulo, SP"
    );
}
module.exports = {infosSeed}