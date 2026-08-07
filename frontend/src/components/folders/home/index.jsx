import './style.scss';
import Download from '@/assets/icons/download.svg?react';
import Project from '@/assets/icons/project.svg?react';
import Laptop from '@/assets/icons/laptop-outline.svg?react';
import Cellphone from '@/assets/icons/cellphone.svg?react';
function main() {
    return (
        <div className="app">
            <div className="home">
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
        </div>
    )
}

export default main