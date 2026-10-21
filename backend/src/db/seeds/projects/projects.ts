const { sqlite } = require("../../index");

function projectsSeed(){
    const insert = sqlite.prepare(`INSERT OR REPLACE INTO project(title, description, external_url, type_id, status) VALUES (?, ?, ?, ?, ?)`);

    const projects = [
        [
        "Posso Ajudar? Desktop",
        "Sistema de gerenciamento desenvolvido para facilitar o controle de clientes, produtos, estoque e vendas.",
        "https://github.com/HiagoCS/can_i_help",
        2,
        1
],
        [
        "Posso Ajudar Mobile",
        "Versão mobile do sistema de gerenciamento Posso Ajudar?, desenvolvida para permitir o controle de vendas, clientes, produtos e estoque diretamente pelo celular.",
        "https://github.com/HiagoCS/can_i_help",
        3,
        1
],
        [
        "Empreiteira Glass",
        "Demonstração de pagina comercial para Empreiteira Glass",
        "https://empreiteiraglass.netlify.app/",
        1,
        1
],
        [
        "J.M Pinturas",
        "Demonstração de pagina comercial para J.M Pinturas",
        "https://jmpinturasmanutencoes.netlify.app/",
        1,
        1
],
        [
        "Star Leme Marmoraria",
        "Demonstração de pagina comercial para Star Leme Marmoraria",
        "https://starlememarmoraria.netlify.app/",
        1,
        1
]
    ];

    projects.map((data) => {
        insert.run(...data);
    });
}

module.exports = { projectsSeed };
