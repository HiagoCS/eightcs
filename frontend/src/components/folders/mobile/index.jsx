import "./style.scss"
import { useState } from "react";
import MobileCard from "./cards/index"
import projects from "@/data/projects/mobile-projects.json"
import MobileModal from "./modal/index";
function main(){
    const [selectedProject, setSelectedProject] = useState(null);
    return(
        <div className="app" id="mobile-section">
            
            {
                
                projects.map((project) =>(
                    <MobileCard
                    key={project.id}
                    project={project}
                    onClick={() => setSelectedProject(project)}/>
                ))
            }
            {
                selectedProject &&
                <MobileModal 
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            }
        </div>
    )
}

export default main