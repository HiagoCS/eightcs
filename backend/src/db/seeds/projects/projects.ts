const { sqlite } = require("../../index");

function projectsSeed(){
    const insert = sqlite.prepare(`
        INSERT OR IGNORE INTO project
        (title, description, external_url, type_id, status)
        VALUES (?, ?, ?, ?, ?)
    `);

    const projects = [
        // Acessórios
        [
            "Guidão Qualymotors",
            "Guidões Qualymotors para diferentes estilos de pilotagem, ofereciendo precisão, conforto e resistência para o motociclista.",
            null,
            1,
            1
        ],
        [
            "Aliviador de embreagem",
            "Aliviadores de embreagem para diferentes estilos de pilotagem, oferecendo leveza, conforto e menor fadiga para o motociclista.",
            null,
            1,
            1
        ],
        [
            "Paralamas 300F para 160",
            "Paralamas 300F adaptados para a Titan/Fan 160, oferecendo design moderno, estilo agressivo e encaixe perfeito para a sua moto.",
            null,
            1,
            1
        ],
        [
            "Tomada USB",
            "Tomadas USB à prova d'água para moto, oferecendo praticidade, carregamento rápido e segurança para o seu celular na estrada.",
            null,
            1,
            1
        ],
        [
            "Pastilhas de freio",
            "Pastilhas de freio de alta durabilidade, oferecendo frenagem precisa, segurança e máxima eficiência para o motociclista.",
            null,
            1,
            1
        ],

        // Manutenção
        [
            "Capa de Banco",
            "Renove o visual e proteja o banco da sua moto, garantindo aderência firme, resistência ao desgaste e mais conforto no dia a dia.",
            null,
            2,
            1
        ],
        [
            "Carga de Bateria",
            "Mantenha a bateria da sua moto sempre pronta para rodar, garantindo partidas confiáveis, carga estável e vida útil prolongada para o sistema elétrico.",
            null,
            2,
            1
        ],
        [
            "Troca de Óleo",
            "Proteja o coração da sua moto, garantindo lubrificação eficiente, menor desgaste das peças e um funcionamento mais suave a cada quilômetro.",
            null,
            2,
            1
        ],
        [
            "Troca de Embreagem",
            "Recupere a precisão e a maciez das trocas de marcha, garantindo respostas rápidas, engates firmes e o máximo desempenho para a sua moto.",
            null,
            2,
            1
        ],

        // Encomendas
        [
            "Peças Sob Encomenda",
            "Não encontrou a peça que procura? Consulte nossa disponibilidade e faça sua encomenda.",
            null,
            3,
            1
        ],
        [
            "Peças Específicas",
            "Encomenda de peças específicas para diferentes modelos de motos conforme a necessidade do cliente.",
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