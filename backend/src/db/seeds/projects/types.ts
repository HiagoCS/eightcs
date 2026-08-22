const { sqlite } = require("../../index");

function typesSeed(){
    const insert = sqlite.prepare(`INSERT OR IGNORE INTO project_type(id, type, status) VALUES (?, ?, ?)`);
    const types = [
        [1, "web", 1],
        [2, "mobile", 1],
        [3, "desktop", 1],
    ];

    types.map((data) =>{
        insert.run(...data);
    });

}
module.exports = {typesSeed}