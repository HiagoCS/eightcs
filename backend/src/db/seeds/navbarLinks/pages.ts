const { sqlite } = require("../../index");

function pagesSeed(){
    const insert = sqlite.prepare(`INSERT OR IGNORE INTO navbar_links(id, label, function, url, type_id) VALUES (?, ?, ?, ?, ?)`);
    const pages = [
        [1, "Início", "HomePage", "/"],
        [2, "Contato", "ContactPage", "/contact"],
        [3, "Web", "WebPage", "/apps/web", 1],
        [4, "Mobile", "MobilePage", "/apps/mobile", 2],
        [5, "Desktop", "DesktopPage", "/apps/desktop", 3]
        
    ];

    pages.map((data) =>{
        insert.run(...data);
    });

}
module.exports = {pagesSeed}