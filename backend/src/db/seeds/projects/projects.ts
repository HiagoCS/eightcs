const { sqlite } = require("../../index");

function projectsSeed(){
    const insert = sqlite.prepare(`INSERT OR REPLACE INTO project(title, description, external_url, type_id, status) VALUES (?, ?, ?, ?, ?)`);

    const projects = [
        [
        "Forro de Gesso e Iluminação",
        "Execução de forro de gesso com preparação para iluminação embutida, proporcionando um acabamento moderno, uniforme e integrado ao ambiente.",
        null,
        1,
        1
],
        [
        "Parede em Drywall",
        "Instalação de parede em drywall para divisão e adequação de ambientes, com acabamento preparado para pintura e integração ao projeto.",
        null,
        1,
        1
],
        [
        "Sanca de Gesso",
        "Confecção e instalação de sanca de gesso para valorizar o ambiente e criar um acabamento diferenciado com possibilidade de iluminação indireta.",
        null,
        1,
        1
],
        [
        "Acabamento de Paredes e Tetos",
        "Preparação, correção e acabamento de paredes e tetos para receber pintura, garantindo superfícies mais uniformes e um resultado final de qualidade.",
        null,
        1,
        1
],
        [
        "Pintura Acetinada em Sala",
        "Aplicação de pintura com acabamento acetinado em ambiente residencial, proporcionando uma superfície sofisticada, uniforme e de fácil manutenção.",
        null,
        2,
        1
],
        [
        "Pintura Texturizada em Fachada",
        "Aplicação de textura e pintura na fachada residencial, criando um acabamento marcante e contribuindo para a valorização visual do imóvel.",
        null,
        2,
        1
],
        [
        "Pintura Geométrica em Ambiente",
        "Criação de pintura geométrica em parede residencial, combinando diferentes formas e tonalidades para personalizar e modernizar o ambiente.",
        null,
        2,
        1
],
        [
        "Pintura de Fachada Predial",
        "Revitalização da fachada de edifício com preparação das superfícies, correções e aplicação de pintura para renovar o aspecto externo do prédio.",
        null,
        3,
        1
],
        [
        "Pintura de Áreas Comuns",
        "Pintura e revitalização de áreas comuns de condomínio, incluindo halls, corredores e demais espaços de circulação.",
        null,
        3,
        1
],
        [
        "Revitalização Predial Completa",
        "Serviço de revitalização de áreas prediais com preparação, correção e pintura de diferentes superfícies, renovando a aparência e o acabamento do imóvel.",
        null,
        3,
        1
]
    ];

    projects.map((data) => {
        insert.run(...data);
    });
}

module.exports = { projectsSeed };
