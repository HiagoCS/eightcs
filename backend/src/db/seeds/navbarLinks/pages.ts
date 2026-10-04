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
        2,
        "Sobre",
        "AboutPage",
        "/sobre",
        null
],
        [
        4,
        "Serviços",
        "ServicosPage",
        "/services",
        4
],
        [
        5,
        "Contabilidade",
        "ContabilidadePage",
        "/services/contabilidade",
        1
],
        [
        6,
        "Declarações",
        "DeclaracoesPage",
        "/services/declaracoes",
        2
],
        [
        7,
        "Consultoria",
        "ConsultoriaPage",
        "/services/consultoria",
        3
],
        [
        3,
        "Contatos",
        "ContactPage",
        "/contato",
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
