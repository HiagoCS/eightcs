import "./style.scss"
import { useState } from "react";
import DesktopCard from "./cards/index"
import projects from "@/data/projects/desktop-projects.json"
import DesktopModal from "./modal/index";
function main(){
    const [selectedProject, setSelectedProject] = useState(null);
    return(
        <div className="app" id="desktop-section">
            
            {
                
                projects.map((project) =>(
                    <DesktopCard
                    key={project.id}
                    project={project}
                    onClick={() => setSelectedProject(project)}/>
                ))
            }
            {
                selectedProject &&
                <DesktopModal 
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            }
        </div>
    )
}

export default main