const { sqlite } = require("../../index");

function typesSeed(){
    const insert = sqlite.prepare(`INSERT OR IGNORE INTO project_type(id, type, status) VALUES (?, ?, ?)`);
    const types = [
        [1, "accessories", 1],
        [2, "maintenance", 1],
        [3, "orders", 1],
    ];

    types.map((data) =>{
        insert.run(...data);
    });

}
module.exports = {typesSeed}