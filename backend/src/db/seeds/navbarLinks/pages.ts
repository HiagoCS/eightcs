const { sqlite } = require("../../index");

function pagesSeed(){
    const insert = sqlite.prepare(`INSERT OR IGNORE INTO navbar_links(id, label, function, url, type_id) VALUES (?, ?, ?, ?, ?)`);
    const pages = [
        [1, "Início", "HomePage", "/"],
        [2, "Web", "WebPage", "/apps/web", 1],
        [3, "Mobile", "MobilePage", "/apps/mobile", 2],
        [4, "Desktop", "DesktopPage", "/apps/desktop", 3],
        [5, "Contato", "ContactPage", "/contact"]
    ];

    pages.map((data) =>{
        insert.run(...data);
    });

}
module.exports = {pagesSeed}