const { sqlite } = require("../../index");

function modalSeed(){
    const insert = sqlite.prepare(`
        INSERT OR IGNORE INTO modal(project_id, text, extension)
        VALUES (?, ?, ?)
    `);

    const modals = [

        // =========================
        // GUIDÃO QUALYMOTORS
        // project_id: 1
        // =========================

        [
            1,
            "Guidões Qualymotors desenvolvidos para diferentes estilos de pilotagem, oferecendo resistência, conforto e controle durante a condução.",
            ".png"
        ],

        // =========================
        // ALIVIADOR DE EMBREAGEM
        // project_id: 2
        // =========================

        [
            2,
            "Aliviadores de embreagem desenvolvidos para reduzir o esforço necessário no acionamento da manete.",
            ".png"
        ],

        // =========================
        // PARALAMAS 300F PARA 160
        // project_id: 3
        // =========================

        [
            3,
            "Paralamas 300F adaptados para Titan e Fan 160, trazendo um visual mais moderno e esportivo para a moto.",
            ".png"
        ],

        // =========================
        // TOMADA USB
        // project_id: 4
        // =========================

        [
            4,
            "Tomadas USB para motocicletas que permitem carregar seu celular e outros dispositivos durante os deslocamentos.",
            ".png"
        ],

        // =========================
        // PASTILHAS DE FREIO
        // project_id: 5
        // =========================

        [
            5,
            "Pastilhas de freio para reposição e manutenção do sistema de frenagem de diferentes modelos de motocicletas.",
            ".png"
        ],

        // =========================
        // CAPA DE BANCO
        // project_id: 6
        // =========================

        [
            6,
            "Capas de banco para renovar a aparência e proteger o banco da sua motocicleta contra o desgaste do uso diário.",
            ".png"
        ],

        // =========================
        // CARGA DE BATERIA
        // project_id: 7
        // =========================

        [
            7,
            "Serviço de carga de bateria para motocicletas que apresentam dificuldades de partida ou necessitam de recuperação da carga.",
            ".png"
        ],

        // =========================
        // TROCA DE ÓLEO
        // project_id: 8
        // =========================

        [
            8,
            "Serviço de troca de óleo para manter a lubrificação adequada e contribuir para o bom funcionamento do motor.",
            ".png"
        ],

        // =========================
        // TROCA DE EMBREAGEM
        // project_id: 9
        // =========================

        [
            9,
            "Serviço de troca de embreagem para motocicletas que apresentam desgaste ou problemas no sistema de acionamento.",
            ".png"
        ],

        // =========================
        // PEÇAS SOB ENCOMENDA
        // project_id: 10
        // =========================

        [
            10,
            "Não encontrou a peça que procura? Consulte nossa equipe para verificar a possibilidade de encomenda.",
            ".png"
        ],

        // =========================
        // PEÇAS ESPECÍFICAS
        // project_id: 11
        // =========================

        [
            11,
            "Encomenda de peças específicas para diferentes modelos de motocicletas conforme a necessidade do cliente.",
            ".png"
        ],
    ];

    modals.map((data) => {
        insert.run(...data);
    });
}

module.exports = { modalSeed };