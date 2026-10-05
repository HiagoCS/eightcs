const { sqlite } = require("../../index");

function projectsSeed(){
    const insert = sqlite.prepare(`INSERT OR REPLACE INTO project(title, description, external_url, type_id, status) VALUES (?, ?, ?, ?, ?)`);

    const projects = [
        [
        "Bancada de Cozinha",
        "Bancadas de cozinha sob medida, projetadas para unir praticidade, resistência e acabamento sofisticado ao ambiente.",
        null,
        1,
        1
],
        [
        "Ilha Gourmet",
        "Ilhas centrais para cozinhas e espaços gourmet, produzidas sob medida para criar um ponto de destaque funcional e sofisticado.",
        null,
        1,
        1
],
        [
        "Pia de Banheiro",
        "Pias e bancadas para banheiros residenciais fabricadas sob medida, com diferentes formatos, acabamentos e opções de cuba.",
        null,
        1,
        1
],
        [
        "Nicho de Banheiro",
        "Nichos em pedra para banheiros, desenvolvidos para organizar produtos e criar um acabamento integrado ao revestimento.",
        null,
        1,
        1
],
        [
        "Bancada de Lavabo",
        "Bancadas personalizadas para lavabos, pensadas para criar ambientes elegantes e marcantes mesmo em espaços compactos.",
        null,
        1,
        1
],
        [
        "Escada em Pedra",
        "Degraus e revestimentos para escadas residenciais, produzidos sob medida para proporcionar continuidade visual e acabamento sofisticado.",
        null,
        1,
        1
],
        [
        "Soleiras e Peitoris",
        "Soleiras e peitoris sob medida para portas, janelas e transições entre ambientes, proporcionando acabamento uniforme e elegante.",
        null,
        1,
        1
],
        [
        "Churrasqueira Gourmet",
        "Revestimentos e bancadas para áreas de churrasqueira e espaços gourmet, combinando resistência, funcionalidade e estética.",
        null,
        1,
        1
],
        [
        "Bancada de Lavanderia",
        "Bancadas para lavanderias residenciais, produzidas sob medida para organizar a área de trabalho e facilitar a rotina.",
        null,
        1,
        1
],
        [
        "Painel e Aparador",
        "Painéis, aparadores e elementos decorativos em pedra para salas e ambientes sociais, criando composições sofisticadas e personalizadas.",
        null,
        1,
        1
],
        [
        "Granito",
        "Rochas de ampla utilização em projetos residenciais, disponíveis em diversas cores e padrões para bancadas, pisos, escadas e outros elementos.",
        null,
        2,
        1
],
        [
        "Mármore",
        "Material de aparência sofisticada e grande variedade estética, utilizado principalmente em ambientes internos e elementos decorativos.",
        null,
        2,
        1
],
        [
        "Quartzito",
        "Rocha natural valorizada pelos padrões marcantes, cores variadas e possibilidades de aplicação em projetos residenciais.",
        null,
        2,
        1
],
        [
        "Travertino",
        "Rocha de aparência característica, muito utilizada para criar ambientes sofisticados e com estética natural.",
        null,
        2,
        1
],
        [
        "Limestone",
        "Pedra de aparência natural e elegante, utilizada em revestimentos, pisos, bancadas e elementos arquitetônicos.",
        null,
        2,
        1
],
        [
        "Ardósia",
        "Rocha natural conhecida por sua textura e aparência característica, disponível em diferentes tonalidades e aplicações.",
        null,
        2,
        1
],
        [
        "Basalto",
        "Rocha de coloração geralmente escura utilizada em revestimentos, pisos e aplicações arquitetônicas.",
        null,
        2,
        1
],
        [
        "Ônix",
        "Material de forte apelo decorativo, conhecido pela variedade de cores e pelo efeito translúcido presente em determinadas variedades.",
        null,
        2,
        1
],
        [
        "Gnaisse",
        "Rocha natural encontrada em diferentes padrões e tonalidades, podendo ser utilizada em aplicações ornamentais e arquitetônicas.",
        null,
        2,
        1
],
        [
        "Pedra-Sabão",
        "Rocha natural de aparência característica, utilizada em peças arquitetônicas, decorativas e algumas aplicações específicas.",
        null,
        2,
        1
]
    ];

    projects.map((data) => {
        insert.run(...data);
    });
}

module.exports = { projectsSeed };
