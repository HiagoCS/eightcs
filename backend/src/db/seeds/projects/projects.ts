const { sqlite } = require("../../index");

function projectsSeed(){
    const insert = sqlite.prepare(`INSERT OR REPLACE INTO project(title, description, external_url, type_id, status) VALUES (?, ?, ?, ?, ?)`);

    const projects = [
        [
        "Envidraçamento de Sacada Residencial",
        "Instalação de sistema de envidraçamento para fechamento de sacada, proporcionando maior proteção contra vento, chuva e poeira, sem comprometer a iluminação e a vista do ambiente.",
        null,
        1,
        1
],
        [
        "Fechamento de Sacada com Vidro",
        "Projeto de fechamento de sacada com vidros, unindo segurança, praticidade e valorização do espaço residencial.",
        null,
        1,
        1
],
        [
        "Envidraçamento de Área Gourmet",
        "Envidraçamento de área gourmet para criar um ambiente mais protegido e confortável, permitindo melhor aproveitamento do espaço em diferentes condições climáticas.",
        null,
        1,
        1
],
        [
        "Instalação de Guarda-Corpo em Vidro",
        "Instalação de guarda-corpo em vidro, oferecendo segurança e um acabamento moderno que valoriza a arquitetura do imóvel.",
        null,
        1,
        1
],
        [
        "Pintura Externa Residencial",
        "Revitalização da área externa de residência com preparação das superfícies, correções e aplicação de pintura para renovar a aparência e proteger o imóvel.",
        null,
        1,
        1
],
        [
        "Pintura Interna e Acabamento",
        "Pintura completa de ambientes internos, com preparação das paredes e atenção aos detalhes para proporcionar um acabamento uniforme e renovado.",
        null,
        1,
        1
],
        [
        "Pintura Comercial Completa",
        "Renovação da pintura de espaço comercial, contribuindo para um ambiente mais agradável, organizado e visualmente atrativo para clientes e colaboradores.",
        null,
        1,
        1
],
        [
        "Reforma de Apartamento",
        "Reforma de apartamento envolvendo melhorias e adequações em diferentes ambientes, buscando mais funcionalidade, conforto e qualidade no acabamento.",
        null,
        1,
        1
],
        [
        "Reforma de Área Externa",
        "Revitalização de área externa com serviços de reforma e acabamento para melhorar a estrutura, a estética e o aproveitamento do espaço.",
        null,
        1,
        1
],
        [
        "Reforma e Modernização de Ambiente",
        "Transformação de ambiente por meio de serviços de reforma e acabamento, adequando o espaço às necessidades do cliente e proporcionando um resultado mais moderno e funcional.",
        null,
        1,
        1
],
        [
        "Residencial Jardim das Palmeiras",
        "Envidraçamento de sacada residencial com instalação dos vidros e acabamento completo, proporcionando maior proteção e melhor aproveitamento do espaço.",
        null,
        2,
        1
],
        [
        "Condomínio Vista do Mar",
        "Execução de pintura interna e externa em áreas residenciais, com preparação das superfícies e acabamento para revitalização dos ambientes.",
        null,
        2,
        1
],
        [
        "Condomínio Vista do Mar",
        "Envidraçamento de sacada residencial com instalação dos vidros e acabamento completo, proporcionando maior proteção e melhor aproveitamento do espaço.",
        null,
        2,
        1
],
        [
        "Espaço Gourmet Bella Casa",
        "Envidraçamento de área gourmet, criando um ambiente mais protegido e confortável para utilização em diferentes condições climáticas.",
        null,
        2,
        1
],
        [
        "Residencial Parque das Flores",
        "Reforma e modernização de apartamento, incluindo serviços de acabamento, pintura e adequações gerais nos ambientes.",
        null,
        2,
        1
],
        [
        "Comercial Center Glass",
        "Reforma e pintura de espaço comercial, com revitalização dos ambientes e melhorias no acabamento para proporcionar uma apresentação mais moderna e agradável.",
        null,
        2,
        1
],
        [
        "s",
        "s",
        null,
        1,
        0
]
    ];

    projects.map((data) => {
        insert.run(...data);
    });
}

module.exports = { projectsSeed };
