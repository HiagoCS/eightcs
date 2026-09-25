import './style.scss';
import { useDynamicLinks } from '@/data/links/functions.jsx';
import Download from '@/assets/icons/download.svg?react';
import Project from '@/assets/icons/project.svg?react';
import Laptop from '@/assets/icons/laptop-outline.svg?react';
import Cellphone from '@/assets/icons/cellphone.svg?react';

import BannerIllustration from './BannerComponent';
import cards from '@/data/cards/index.json';
import { cardsIcons } from '@/data/cards/functions.jsx';
export default function HomePage() {
    const { links, isLoading, data } = useDynamicLinks();
    const { icons } = cardsIcons();
    if (isLoading) return console.log("<p>Loading...</p>")
    return (
        <div className="app">
            <div className="home-banner">

                <div className="banner-content">
                    <span>Olá, meu nome é</span>

                    <h1>Hiago Costa Santos</h1>

                    <h2>Desenvolvedor Full-Stack</h2>

                    <p>
                        Desenvolvedor Full-Stack formado em Análise e
                        Desenvolvimento de Sistemas.
                    </p>

                    <div className="banner-buttons">
                        <button>
                            <Project className="icon" style={{ width: '1.2pc', height: '1.5pc' }} />
                            <span>O que é 8CS?</span>
                        </button>
                        <button>
                            <Download className="icon" style={{ width: '1.2pc', height: '1.5pc' }} />
                            <span>Baixar Currículo</span>
                        </button>
                    </div>
                </div>
                <div className="banner-illustration">
                    <BannerIllustration />
                </div>
            </div>
            <div className="home">
                <span className="home-title">O Que Eu Desenvolvo</span>
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
                                                }}>{link.card.type_id ? "Ver Projetos" : link.card.title} ➡️</a>
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