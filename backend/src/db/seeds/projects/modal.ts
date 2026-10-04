const { sqlite } = require("../../index");

function modalSeed(){
    const insert = sqlite.prepare(`INSERT OR REPLACE INTO modal(project_id, text, extension) VALUES (?, ?, ?)`);

    const modals = [
        [
        1,
        "Orientação para manter as obrigações do MEI organizadas e acompanhar as principais responsabilidades do negócio.",
        ".jpg"
],
        [
        2,
        "Organização dos documentos e informações necessários para preparar a declaração anual.",
        ".jpg"
],
        [
        3,
        "Identificação das principais pendências que podem afetar a situação fiscal do cliente.",
        ".jpg"
],
        [
        4,
        "Orientação inicial para entender os requisitos e informações necessários para a formalização como MEI.",
        ".jpg"
],
        [
        5,
        "Atendimento individual para compreender a necessidade apresentada pelo cliente.",
        ".jpg"
],
        [
        6,
        "Organização das informações financeiras para facilitar o acompanhamento das movimentações do negócio.",
        ".jpg"
]
    ];

    modals.map((data) => {
        insert.run(...data);
    });
}

module.exports = { modalSeed };
