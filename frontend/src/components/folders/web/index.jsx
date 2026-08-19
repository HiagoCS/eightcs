import "./style.scss"
import { useState } from "react";
import WebCard from "./cards/index"
import projects from "@/data/web-projects.json"
import WebModal from "./modal";
function main(){
    const [selectedProject, setSelectedProject] = useState(null);
    return(
        <div className="app" id="web-section">
            
            {
                
                projects.map((project) =>(
                    <WebCard
                    key={project.id}
                    project={project}/>
                ))
            }
            {
                selectedProject &&
                <WebModal 
                    project={selectedProject}
                    onClosed={() => setSelectedProject(null)}
                />
            }
        </div>
    )
}

export default main