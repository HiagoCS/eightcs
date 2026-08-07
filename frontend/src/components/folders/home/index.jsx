import './style.scss';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import Download from '@/assets/icons/download.svg?react';
import Project from '@/assets/icons/project.svg?react';
import Laptop from '@/assets/icons/laptop-outline.svg?react';
import Cellphone from '@/assets/icons/cellphone.svg?react';
import Web from '@/assets/icons/web.svg?react';
import Mobile from '@/assets/icons/android-solid.svg?react';
import Desktop from '@/assets/icons/desktop.svg?react';
import Contact from '@/assets/icons/contact.svg?react';
function main() {
    return (
        <div className="app">
            <div className="home-banner">
                <div className="info">
                    <div className="hello">
                        <span>Olá, meu nome é</span>
                    </div>
                    <div className="name">
                        <span style={{ fontSize: '3pc', fontFamily: 'Quicksand-Bold' }}>Hiago Costa Santos</span>
                    </div>
                    <div className="text">
                        <span>Desenvolvedor Full-Stack formado em Análise e Desenvolvimento de Sistemas pela instituição Centro Paula Souza</span>
                    </div>
                    <div className="buttons">
                        <span className="all">
                            <button>
                                <Project className="icon" style={{ width: '1.2pc', height: '1.5pc' }} />
                                O que é 8CS?
                            </button>
                        </span>
                        <span className="cv">
                            <button title="Baixar Currículo">
                                <Download className="icon" style={{ width: '1.2pc', height: '1.5pc' }} />
                                Baixar Currículo
                            </button>
                        </span>
                    </div>
                </div>
                <div className="images">
                    <div className="icon">
                        <Laptop className="lap" style={{ width: '15vw', height: '30vh' }} />

                        <Cellphone className="cell" style={{ width: '15vw', height: '30vh' }} />
                    </div>
                </div>
            </div>
            <div className="home">
                <span className="home-title">O Que Eu Desenvolvo</span>
                <div className="cards-display">
                    <div className="card web">
                        <div className="icon">
                            <Web style={{ width: '3pc', height: '3pc' }} />
                        </div>
                        <div className="info">
                            <span className="title">Web</span>
                            <span className="text">
                                Aplicações modernas, responsivas e otimizadas para entregar a melhor experiência na web.
                            </span>
                            <a href="/#web-section" className='link'
                            onClick={() => {
                                setTimeout(()=>{
                                    history.replaceState(null, '', window.location.pathname);
                                }, 1)
                            }}>Ver Projetos ➡️</a>
                        </div>
                    </div>
                    <div className="card mobile">
                        <div className="icon">
                            <Mobile style={{ width: '3pc', height: '3pc' }} />
                        </div>
                        <div className="info">
                            <span className="title">Mobile</span>
                            <span className="text"> 
                                Apps para IOS e Android com foco em performance, usabilidade e design moderno.
                            </span>
                            <a href="/#mobile-section" className='link'
                            onClick={() => {
                                setTimeout(()=>{
                                    history.replaceState(null, '', window.location.pathname);
                                }, 1)
                            }}>Ver Projetos ➡️</a>
                        </div>
                    </div>
                    <div className="card desktop">
                        <div className="icon">
                            <Desktop style={{ width: '3pc', height: '3pc' }} />
                        </div>
                        <div className="info">
                            <span className="title">Desktop</span>
                            <span className="text">
                                Soluções desktop utilizando tecnologias modernas e frameworks populares para atender às necessidades do usuário.
                            </span>
                            <a href="/#desktop-section" className='link'
                            onClick={() => {
                                setTimeout(()=>{
                                    history.replaceState(null, '', window.location.pathname);
                                }, 1)
                            }}>Ver Projetos ➡️</a>
                        </div>
                    </div>
                    <div className="card contact">
                        <div className="icon">
                            <Contact style={{ width: '3pc', height: '3pc' }} />
                        </div>
                        <div className="info">
                            <span className="title">Contato</span>
                            <span className="text">
                                Gostou da plataforma, entre em contato comigo para que possamos conversar sobre o seu projeto.
                            </span>
                            <span className="link">
                                Fale Conosco ➡️
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div id="web-section">
                <h1>WEB</h1>
            </div>
            <div id="mobile-section">
                <h1>MOBILE</h1>
            </div>
            <div id="desktop-section">
                <h1>DESKTOP</h1>
            </div>
        </div>
    )
}

export default main