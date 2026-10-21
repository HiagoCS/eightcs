const { sqlite } = require("../../index");

function pagesSeed(){
    const insert = sqlite.prepare(`INSERT OR REPLACE INTO navbar_links(id, label, function, url, type_id) VALUES (?, ?, ?, ?, ?)`);

    const pages = [
        [
        1,
        "Ínicio",
        "HomePage",
        "/",
        null
],
        [
        3,
        "Web",
        "WebPage",
        "/apps/web",
        1
],
        [
        4,
        "Desktop",
        "DesktopPage",
        "/apps/desktop",
        2
],
        [
        5,
        "Mobile",
        "MobilePage",
        "/apps/mobile",
        3
],
 [
        6,
        "Contatos",
        "ContactPage",
        "/contato",
        null
],
        [
        2,
        "Entre em contato",
        "FormPage",
        "/form",
        null
]
    ];

    pages.map((data) => {
        insert.run(...data);
    });

    // HomePage é obrigatória.
    // ContactPage é opcional.
    // Links com categoria usam o ID de project_type.
}

module.exports = { pagesSeed };
