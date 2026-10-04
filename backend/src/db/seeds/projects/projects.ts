const { sqlite } = require("../../index");

function projectsSeed(){
    const insert = sqlite.prepare(`INSERT OR REPLACE INTO project(title, description, external_url, type_id, status) VALUES (?, ?, ?, ?, ?)`);

    const projects = [
        [
        "Contabilidade para MEI",
        "Suporte para MEIs na organização das obrigações do negócio, acompanhamento das atividades e orientação para manter a situação fiscal regularizada.",
        null,
        1,
        1
],
        [
        "Declaração de Imposto de Renda",
        "Auxílio no preenchimento e organização das informações necessárias para a declaração anual do Imposto de Renda da Pessoa Física.",
        null,
        2,
        1
],
        [
        "Regularização Fiscal",
        "Orientação para identificação e organização de pendências fiscais e contábeis de pessoas físicas e pequenos negócios.",
        null,
        1,
        1
],
        [
        "Abertura de MEI",
        "Orientação para quem deseja formalizar uma atividade profissional como Microempreendedor Individual.",
        null,
        3,
        1
],
        [
        "Consultoria Contábil",
        "Atendimento personalizado para esclarecer dúvidas contábeis, financeiras e fiscais de acordo com a realidade de cada cliente.",
        null,
        3,
        1
],
        [
        "Organização Financeira",
        "Orientação para organizar informações financeiras, acompanhar movimentações e melhorar a visão sobre a rotina econômica do negócio.",
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
