import './style.scss';
import { useInfos } from "@/data/hooks/useInfos";
function main() {
    const { data: infos, isLoading, error } = useInfos();
    if (isLoading) return console.log("Loading...")
    if (error) return console.log(error.message)
    if (!infos) return console.log("Nenhuma informação de cliente encontrada!")
    let company = '';
    if (infos['company'])
        company = infos['company'].includes(' ') ? infos['company'].split(' ') : null;
    return (
        <div className="app banner">
            <div className="banner">
                
                <div className="banner-name">
                    <img src="./logo.png" width={"100vw"} height={"80vh"} alt="" />
                    <svg
                        style={{ width: '20px', height: '80px' }}
                        viewBox="0 0 100 20"
                        preserveAspectRatio="none"
                    >
                        <line
                            x1="50%"
                            y1="0%"
                            x2="50%"
                            y2="100%"
                            stroke="#FAE6B9"
                            strokeWidth="2"
                        />
                    </svg>
                    <div className="name">
                        <h1>{infos['name']}</h1>
                        <h2>{infos['occupation']}</h2>
                    </div>
                </div>
                <div className="logo">
                    <span className='text'>{infos['banner_top']}</span>
                    <svg
                        style={{ width: '10vw', height: '20px' }}
                        viewBox="0 0 100 20"
                        preserveAspectRatio="none"
                    >
                        <line
                            x1="0%"
                            y1="50%"
                            x2="100%"
                            y2="50%"
                            stroke="#FAE6B9"
                            strokeWidth="2"
                        />
                    </svg>
                </div>
            </div>
        </div>
    )
}

export default main