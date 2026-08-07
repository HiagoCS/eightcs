import './style.scss';
import Download from '@/assets/icons/download.svg?react';
import Project from '@/assets/icons/project.svg?react';
import Laptop from '@/assets/icons/laptop-outline.svg?react';
import Cellphone from '@/assets/icons/cellphone.svg?react';
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
                                Ver Projetos
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
                <span className="title">O Que Eu Desenvolvo</span>
                <br />
                <div className="cards-display">
                    <div className="card web">
                        <div className="icon">
                            <Laptop className="lap" style={{ width: '3pc', height: '3pc' }} />
                        </div>
                        <div className="info">
                            <span className="title">Web</span>
                            <span className="text">
                                Desenvolvimento de aplicações web utilizando tecnologias modernas e frameworks populares.
                            </span>
                            <span className="link">
                                Ver Projetos ➡️
                            </span>
                        </div>
                    </div>
                    <div className="card mobile">
                        <div className="icon">
                            <Laptop className="lap" style={{ width: '3pc', height: '3pc' }} />
                        </div>
                        <div className="info">
                            <span className="title">Mobile</span>
                            <span className="text">
                                Desenvolvimento de aplicações mobile utilizando tecnologias modernas e frameworks populares.
                            </span>
                            <span className="link">
                                Ver Projetos ➡️
                            </span>
                        </div>
                    </div>
                    <div className="card desktop">
                        <div className="icon">
                            <Laptop className="lap" style={{ width: '3pc', height: '3pc' }} />
                        </div>
                        <div className="info">
                            <span className="title">Desktop</span>
                            <span className="text">
                                Desenvolvimento de aplicações desktop utilizando tecnologias modernas e frameworks populares.
                            </span>
                            <span className="link">
                                Ver Projetos ➡️
                            </span>
                        </div>
                    </div>
                    <div className="card contact">
                        <div className="icon">
                            <Laptop className="lap" style={{ width: '3pc', height: '3pc' }} />
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
        </div>
    )
}

export default main