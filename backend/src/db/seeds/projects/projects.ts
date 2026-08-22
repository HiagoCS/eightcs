const { sqlite } = require("../../index");

function projectsSeed(){
    const insert = sqlite.prepare(`INSERT OR IGNORE INTO project(title, description, external_url, type_id, status) VALUES (?, ?, ?, ?, ?)`);
    const projects = [
        ["Posso Ajudar? Mobile", "Versão mobile do sistema de gerenciamento Posso Ajudar?, desenvolvida para permitir o controle de vendas, clientes, produtos e estoque diretamente pelo celular.", null, 2, 1],
        ["Posso Ajudar?", "Sistema de gerenciamento desenvolvido para facilitar o controle de clientes, produtos, estoque e vendas.", null, 3, 1]
    ];

    projects.map((data) =>{
        insert.run(...data);
    });

}
module.exports = {projectsSeed}