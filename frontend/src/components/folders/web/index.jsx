import "./style.scss"
import WebCard from "./cards/index"
import projects from "@/data/web-projects.json"
function main(){
    return(
        <div className="app" id="web-section">
            <WebCard
                key={projects[0].id}
                project={projects[0]}
            />
        </div>
    )
}

export default main