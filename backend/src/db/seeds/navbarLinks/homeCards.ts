const { sqlite } = require("../../index");

function homeCardsSeed(){
    const insert = sqlite.prepare(`INSERT OR IGNORE INTO home_cards(id, title, text, class, icon, link_id, type_id) VALUES (?, ?, ?, ?, ?, ?, ?)`);
    const cards = [
        [1, "Web", "Aplicações modernas, responsivas e otimizadas para entregar a melhor experiência na web.", "web", "Web", 2, 1],
        [2, "Mobile", "Apps para IOS e Android com foco em performance, usabilidade e design moderno.", "mobile", "Mobile", 3, 2],
        [3, "Desktop", "Soluções desktop utilizando tecnologias modernas e frameworks populares para atender às necessidades do usuário.", "desktop", "Desktop", 4, 3],
        [4, "Contato", "Gostou da plataforma, entre em contato comigo para que possamos conversar sobre o seu projeto.", "contact", "Contact", 5, null]
    ];

    cards.map((data) =>{
        insert.run(...data);
    });

}
module.exports = {homeCardsSeed}