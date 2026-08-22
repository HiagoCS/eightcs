const { sqlite } = require("../../index");

function iconsSeed(){
    const insert = sqlite.prepare(`INSERT OR IGNORE INTO icons_links(id, function, external_url) VALUES (?, ?, ?)`);
    const icons = [
        [1, "whatsapp", ""],
        [2, "linkedin", ""],
        [3, "github", ""]
    ];

    icons.map((data) =>{
        insert.run(...data);
    });

}
module.exports = {iconsSeed}