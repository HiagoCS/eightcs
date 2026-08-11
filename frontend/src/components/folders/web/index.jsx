import "./style.scss"
import WebCard from "./cards/index"
import projects from "@/data/web-projects.json"
function main(){
    return(
        <div className="app" id="web-section">
            
            {
                
                projects.map((project) =>(
                    <WebCard
                    key={project.id}
                    project={project}/>
                ))
            }
        </div>
    )
}

export default main