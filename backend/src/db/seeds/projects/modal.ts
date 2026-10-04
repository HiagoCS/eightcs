const { sqlite } = require("../../index");

function modalSeed(){
    const insert = sqlite.prepare(`INSERT OR REPLACE INTO modal(project_id, text, extension) VALUES (?, ?, ?)`);

    const modals = [
        [
        1,
        "Vista frontal da sacada após a instalação do sistema de envidraçamento.",
        ".png"
],
        [
        1,
        "Detalhe dos painéis de vidro e do sistema de abertura instalado na sacada.",
        ".png"
],
        [
        1,
        "Acabamento final do envidraçamento integrado à fachada residencial.",
        ".png"
],
        [
        2,
        "Fechamento completo da sacada com painéis de vidro.",
        ".png"
],
        [
        2,
        "Detalhe do sistema de fechamento e alinhamento dos vidros.",
        ".png"
],
        [
        2,
        "Resultado final do projeto com a sacada protegida e valorizada.",
        ".png"
],
        [
        3,
        "Área gourmet antes da instalação do sistema de envidraçamento.",
        ".png"
],
        [
        3,
        "Instalação dos painéis de vidro na área gourmet.",
        ".png"
],
        [
        3,
        "Área gourmet finalizada com fechamento em vidro e acabamento completo.",
        ".png"
],
        [
        4,
        "Instalação do guarda-corpo de vidro em área residencial.",
        ".png"
],
        [
        4,
        "Detalhe dos vidros e dos elementos de fixação do guarda-corpo.",
        ".png"
],
        [
        4,
        "Resultado final do guarda-corpo integrado ao projeto arquitetônico.",
        ".png"
],
        [
        5,
        "Preparação das superfícies externas para início dos serviços de pintura.",
        ".png"
],
        [
        5,
        "Aplicação da pintura nas áreas externas da residência.",
        ".png"
],
        [
        5,
        "Fachada residencial após a conclusão da pintura e dos acabamentos.",
        ".png"
],
        [
        6,
        "Preparação das paredes e ambientes para execução da pintura interna.",
        ".png"
],
        [
        6,
        "Execução da pintura e acabamento das paredes internas.",
        ".png"
],
        [
        6,
        "Ambiente finalizado com pintura uniforme e acabamento renovado.",
        ".png"
],
        [
        7,
        "Preparação do espaço comercial para início da revitalização.",
        ".png"
],
        [
        7,
        "Execução dos serviços de pintura nas áreas internas do estabelecimento.",
        ".png"
],
        [
        7,
        "Espaço comercial após a conclusão da pintura e dos acabamentos.",
        ".png"
],
        [
        8,
        "Ambiente do apartamento durante o início dos serviços de reforma.",
        ".png"
],
        [
        8,
        "Execução dos serviços de reforma e adequação dos ambientes.",
        ".png"
],
        [
        8,
        "Apartamento após a conclusão da reforma e dos acabamentos.",
        ".png"
],
        [
        9,
        "Área externa antes do início dos trabalhos de reforma.",
        ".png"
],
        [
        9,
        "Execução dos serviços de reforma e revitalização da área externa.",
        ".png"
],
        [
        9,
        "Área externa finalizada com novo acabamento e melhor aproveitamento.",
        ".png"
],
        [
        10,
        "Ambiente antes do início do projeto de reforma e modernização.",
        ".png"
],
        [
        10,
        "Etapa de execução da reforma e aplicação dos novos acabamentos.",
        ".png"
],
        [
        10,
        "Ambiente modernizado após a conclusão dos serviços.",
        ".png"
],
        [
        11,
        "Resultado do envidraçamento de sacada realizado no Residencial Jardim das Palmeiras.",
        ".png"
],
        [
        12,
        "Áreas residenciais do Condomínio Vista do Mar após a execução dos serviços de pintura e acabamento.",
        ".png"
],
        [
        13,
        "Sacada do Condomínio Vista do Mar após a instalação do sistema de envidraçamento.",
        ".png"
],
        [
        14,
        "Área gourmet do Espaço Gourmet Bella Casa após a instalação do envidraçamento.",
        ".png"
],
        [
        15,
        "Apartamento do Residencial Parque das Flores após a conclusão da reforma, pintura e dos acabamentos.",
        ".png"
]
    ];

    modals.map((data) => {
        insert.run(...data);
    });
}

module.exports = { modalSeed };
