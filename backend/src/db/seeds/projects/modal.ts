const { sqlite } = require("../../index");

function modalSeed(){
    const insert = sqlite.prepare(`INSERT OR REPLACE INTO modal(project_id, text, extension) VALUES (?, ?, ?)`);

    const modals = [
        [
        1,
        "Bancada fabricada sob medida de acordo com as dimensões e características do ambiente, garantindo aproveitamento adequado do espaço.",
        ".png"
],
        [
        1,
        "Possibilidade de personalização de recortes, cuba, frontão, saias e acabamentos para adaptar a bancada ao projeto da cozinha.",
        ".png"
],
        [
        1,
        "Uma solução pensada para integrar funcionalidade e estética, valorizando a cozinha em cada detalhe.",
        ".png"
],
        [
        2,
        "Ilhas projetadas de acordo com o espaço disponível e a proposta visual do ambiente.",
        ".png"
],
        [
        2,
        "O acabamento pode ser personalizado conforme o material escolhido, dimensões e necessidades do projeto.",
        ".png"
],
        [
        2,
        "Ideal para criar uma área central de apoio, preparo e convivência em cozinhas residenciais.",
        ".png"
],
        [
        3,
        "Bancadas dimensionadas para se adaptar ao espaço disponível no banheiro e ao estilo do projeto.",
        ".png"
],
        [
        3,
        "Podemos trabalhar diferentes configurações de cuba, saias, frontões e acabamentos conforme a proposta.",
        ".png"
],
        [
        3,
        "O resultado combina praticidade para o uso diário com um acabamento sofisticado para o ambiente.",
        ".png"
],
        [
        4,
        "Nichos produzidos sob medida para aproveitar melhor os espaços dentro da área do banho.",
        ".png"
],
        [
        4,
        "O material pode acompanhar ou contrastar com os demais revestimentos do ambiente.",
        ".png"
],
        [
        4,
        "Uma solução funcional que também contribui para a composição estética do banheiro.",
        ".png"
],
        [
        5,
        "Dimensões definidas de acordo com o espaço disponível e a proposta arquitetônica do lavabo.",
        ".png"
],
        [
        5,
        "Diferentes materiais e acabamentos permitem criar desde uma composição discreta até uma peça de grande destaque.",
        ".png"
],
        [
        5,
        "Uma bancada bem especificada transforma o lavabo em um dos destaques do projeto residencial.",
        ".png"
],
        [
        6,
        "Cada degrau é produzido conforme as medidas da escada e as características da estrutura existente.",
        ".png"
],
        [
        6,
        "A escolha do material e do acabamento pode transformar a escada em um elemento de destaque da residência.",
        ".png"
],
        [
        6,
        "Uma solução que integra circulação, arquitetura e acabamento em uma única composição.",
        ".png"
],
        [
        7,
        "Peças produzidas sob medida para acompanhar as dimensões das portas, janelas e vãos existentes.",
        ".png"
],
        [
        7,
        "Os materiais podem ser escolhidos para combinar com pisos, bancadas e demais elementos da residência.",
        ".png"
],
        [
        7,
        "Além da função prática, os detalhes de acabamento ajudam a criar continuidade visual entre os ambientes.",
        ".png"
],
        [
        8,
        "Bancadas e revestimentos desenvolvidos para compor áreas gourmet residenciais de diferentes tamanhos.",
        ".png"
],
        [
        8,
        "O projeto pode integrar bancada de apoio, churrasqueira, cuba e demais elementos da área.",
        ".png"
],
        [
        8,
        "Uma composição pensada para transformar o espaço gourmet em uma área confortável para receber e aproveitar.",
        ".png"
],
        [
        9,
        "Bancadas dimensionadas de acordo com a estrutura da lavanderia e os equipamentos presentes no ambiente.",
        ".png"
],
        [
        9,
        "O projeto pode incluir recortes e espaços planejados para tanque, cuba e demais elementos.",
        ".png"
],
        [
        9,
        "Uma solução prática para melhorar a organização e o aproveitamento da lavanderia.",
        ".png"
],
        [
        10,
        "Peças desenvolvidas para criar um elemento de destaque na sala ou em outros ambientes sociais da residência.",
        ".png"
],
        [
        10,
        "O desenho e o acabamento podem ser definidos de acordo com o estilo arquitetônico e a composição dos móveis.",
        ".png"
],
        [
        10,
        "Materiais com veios, texturas e cores marcantes podem transformar a pedra em protagonista do ambiente.",
        ".png"
],
        [
        11,
        "O granito está entre os principais materiais utilizados no mercado brasileiro de rochas ornamentais, com ampla variedade de cores, padrões e aplicações.",
        ".png"
],
        [
        12,
        "O mármore oferece grande variedade de cores e veios, sendo bastante utilizado em banheiros, lavabos, paredes, pisos e peças decorativas. A escolha deve considerar a aplicação e as características específicas da variedade.",
        ".png"
],
        [
        13,
        "Os quartzitos possuem grande diversidade visual e vêm ganhando espaço em projetos residenciais, especialmente em bancadas e áreas de destaque.",
        ".png"
],
        [
        14,
        "O travertino apresenta aparência natural e marcante, podendo ser utilizado em diferentes elementos arquitetônicos e decorativos de projetos residenciais.",
        ".png"
],
        [
        15,
        "Os limestones possuem estética natural e tons geralmente suaves, sendo uma opção para projetos que buscam uma composição leve e sofisticada.",
        ".png"
],
        [
        16,
        "A ardósia é utilizada em revestimentos e elementos arquitetônicos, oferecendo uma estética natural e diferenciada ao projeto.",
        ".png"
],
        [
        17,
        "O basalto oferece uma estética sóbria e contemporânea, podendo ser utilizado para criar ambientes de aparência marcante e natural.",
        ".png"
],
        [
        18,
        "O ônix é valorizado principalmente pelo efeito visual e pelas possibilidades decorativas, podendo criar peças de destaque em ambientes residenciais.",
        ".png"
],
        [
        19,
        "O gnaisse apresenta padrões minerais característicos e pode ser encontrado em aplicações ornamentais e de revestimento.",
        ".png"
],
        [
        20,
        "A pedra-sabão possui características próprias de textura e aparência, sendo tradicionalmente utilizada em peças ornamentais e arquitetônicas.",
        ".png"
]
    ];

    modals.map((data) => {
        insert.run(...data);
    });
}

module.exports = { modalSeed };
