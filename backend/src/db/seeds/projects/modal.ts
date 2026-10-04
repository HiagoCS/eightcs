const { sqlite } = require("../../index");

function modalSeed(){
    const insert = sqlite.prepare(`INSERT OR REPLACE INTO modal(project_id, text, extension) VALUES (?, ?, ?)`);

    const modals = [
        [
        1,
        "Detalhes da execução do forro de gesso e preparação para iluminação embutida.",
        ".png"
],
        [
        1,
        "Acabamento final do forro, com superfícies uniformes e alinhadas ao projeto.",
        ".png"
],
        [
        1,
        "Resultado da instalação do forro de gesso integrado à iluminação do ambiente.",
        ".png"
],
        [
        2,
        "Instalação da estrutura em drywall para divisão e adequação do ambiente.",
        ".png"
],
        [
        2,
        "Fechamento das placas de drywall e preparação da superfície para o acabamento.",
        ".png"
],
        [
        2,
        "Resultado final da parede em drywall pronta para receber pintura.",
        ".png"
],
        [
        3,
        "Montagem da estrutura da sanca de gesso conforme o projeto do ambiente.",
        ".png"
],
        [
        3,
        "Detalhamento do acabamento da sanca e preparação para iluminação indireta.",
        ".png"
],
        [
        3,
        "Resultado final da sanca de gesso valorizando o ambiente.",
        ".png"
],
        [
        4,
        "Preparação das paredes e tetos para correção das imperfeições da superfície.",
        ".png"
],
        [
        4,
        "Aplicação do acabamento para deixar paredes e tetos mais uniformes.",
        ".png"
],
        [
        4,
        "Resultado final das superfícies preparadas para receber pintura.",
        ".png"
],
        [
        5,
        "Preparação da sala antes da aplicação da pintura com acabamento acetinado.",
        ".png"
],
        [
        5,
        "Aplicação uniforme da pintura acetinada nas paredes do ambiente.",
        ".png"
],
        [
        5,
        "Resultado final da sala com acabamento sofisticado e de fácil manutenção.",
        ".png"
],
        [
        6,
        "Preparação da fachada residencial antes da aplicação da textura.",
        ".png"
],
        [
        6,
        "Aplicação da textura e pintura para renovar a aparência externa do imóvel.",
        ".png"
],
        [
        6,
        "Resultado final da fachada com acabamento marcante e uniforme.",
        ".png"
],
        [
        7,
        "Preparação da parede para criação da composição geométrica.",
        ".png"
],
        [
        7,
        "Aplicação das formas geométricas com diferentes cores e tonalidades.",
        ".png"
],
        [
        7,
        "Resultado final da pintura geométrica no ambiente residencial.",
        ".png"
],
        [
        8,
        "Preparação da fachada predial com correções e tratamento das superfícies.",
        ".png"
],
        [
        8,
        "Aplicação da pintura durante o processo de revitalização da fachada.",
        ".png"
],
        [
        8,
        "Resultado final da fachada predial renovada e com novo acabamento.",
        ".png"
],
        [
        9,
        "Preparação das áreas comuns antes do início da pintura.",
        ".png"
],
        [
        9,
        "Aplicação da pintura em halls, corredores e espaços de circulação.",
        ".png"
],
        [
        9,
        "Resultado final das áreas comuns revitalizadas e com acabamento renovado.",
        ".png"
],
        [
        10,
        "Preparação das superfícies durante o início da revitalização predial.",
        ".png"
],
        [
        10,
        "Execução das etapas de correção e pintura em diferentes áreas do imóvel.",
        ".png"
],
        [
        10,
        "Resultado final da revitalização predial com aparência renovada.",
        ".png"
]
    ];

    modals.map((data) => {
        insert.run(...data);
    });
}

module.exports = { modalSeed };
