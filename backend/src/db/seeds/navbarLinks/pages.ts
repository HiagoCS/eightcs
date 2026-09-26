const { sqlite } = require("../../index");

function pagesSeed(){
    const insert = sqlite.prepare(`INSERT OR IGNORE INTO navbar_links(id, label, function, url, type_id) VALUES (?, ?, ?, ?, ?)`);
    const pages = [
        [1, "Início", "HomePage", "/"],
        [2, "Acessórios", "AccessoriesPage", "/serviços/acessorios", 1],
        [3, "Manutenção", "MaintenancePage", "/serviços/manutencao", 2],
        [4, "Encomendas", "OrdersPage", "/serviços/encomendas", 3],
        [5, "Contato", "ContactPage", "/contato"]
    ];

    pages.map((data) =>{
        insert.run(...data);
    });

}
module.exports = {pagesSeed}