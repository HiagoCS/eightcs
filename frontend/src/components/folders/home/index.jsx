import './style.scss';
function main(){
    return(
        <div className="app home">
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
                        <button>Ver Projetos</button>
                    </span>
                    <span className="cv">
                        <button>Baixar Currículo</button>
                    </span>
                </div>
            </div>
            <div className="images">
                <div className="icon">

                </div>
                <div className="icon">
                    
                </div>
            </div>
        </div>
    )
}

export default main