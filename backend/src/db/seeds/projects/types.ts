const { sqlite } = require("../../index");

function typesSeed(){
    const insert = sqlite.prepare(`INSERT OR REPLACE INTO project_type(id, type, status) VALUES (?, ?, ?)`);

    const types = [
        [
        1,
        "portfolio",
        1
],
        [
        2,
        "clientes",
        1
]
    ];

    types.map((data) => {
        insert.run(...data);
    });

    // project_type.type recebe o slug gerado a partir de type.name.
    // O status controla se o tipo está ativo.
}

module.exports = { typesSeed };
