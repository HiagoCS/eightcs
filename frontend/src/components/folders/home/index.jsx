import './style.scss';
import { useDynamicLinks } from '@/data/links/functions.jsx';

import BannerIllustration from './BannerComponent';
import cards from '@/data/cards/index.json';
import { cardsIcons } from '@/data/cards/functions.jsx';

import { useInfos } from "@/data/hooks/useInfos";
export default function HomePage() {
    const { data: infos } = useInfos();
    const { links, data } = useDynamicLinks();
    const { icons } = cardsIcons();
    if (!infos) return console.log("Nenhuma informação de cliente encontrada!")
    if(!data) return console.log("Nenhuma função encontrada!")
    if(!links) return console.log("Nenhum link encontrado!")
    return (
        <div className="app">
            <div className="home-banner">

                <div className="banner-content">

                    <h1>{infos['name']}</h1>

                    <h2>{infos['occupation']}</h2>

                    <p>{infos['description']}</p>

                </div>
                <div className="banner-illustration">
                    <BannerIllustration />
                </div>
            </div>
            <div className="home">
                <span className="home-title">Nossos serviços</span>
                <div className="cards-display">
                    {
                        data.map((link) => {
                            if (link.card.id) {
                                const Component = icons[cards[cards.findIndex((card) => card.icon.toLowerCase() === link.card.icon.toLowerCase())].icon];
                                return (
                                    <div key={link.card.id} className={`card ${link.card.class}`}>
                                        <div className="icon">
                                            <Component style={{ width: '3pc', height: '3pc' }} />
                                        </div>
                                        <div className="info">
                                            <span className="title">{link.card.title}</span>
                                            <span className="text">{link.card.text}</span>
                                            <a className='link'
                                                onClick={() => {
                                                    const el = document.querySelector(`.${link.card.type_id ? "project" : "app"}.${link.card.class}`);
                                                    if (el) {
                                                        el.scrollIntoView({ behavior: "smooth", block: "center" });
                                                    }
                                                }}>{link.card.type_id ? "Ver Produtos" : link.card.title} ➡️</a>
                                        </div>
                                    </div>
                                )
                            }
                        })
                    }
                </div>
            </div>
            {data.map((link) => {
                if (links[link.function] && link.url !== "/" && link.typeId) {
                    const Component = links[link.function];
                    const type = link.function.toLowerCase().replace("page", "");
                    return (
                        <Component id="pages" key={type} type={type} />
                    );
                }
            })}
            {data.map((link) => {
                if (links[link.function] && link.url !== "/" && !link.typeId) {
                    const Component = links[link.function];
                    const type = link.function.toLowerCase().replace("page", "");
                    return (
                        <Component id="pages" key={type} type={type} />
                    );
                }
            })}
        </div>
    )
}