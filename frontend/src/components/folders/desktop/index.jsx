import "./style.scss"
import { useState } from "react";
import DesktopCard from "./cards/index"
//import projects from "@/data/projects/desktop-projects.json"
import DesktopModal from "./modal/index";

import { useProjects } from "@/data/hooks/useProjects";
function main(){
    const [selectedProject, setSelectedProject] = useState(null);

    const { data: projects, isLoading, error } = useProjects(2);
    console.log(projects)
    if(isLoading) return <p>Loading...</p>
    if(error) return <p>Error: {error.message}</p>
    if(!projects.data?.length) return <p>Nenhum projecto encontrado!</p>

    projects.data.map((project) =>{
        console.log("project", project)
    });
    return(
        <div className="app" id="desktop-section">
            
            {
                
                projects.data.map((project) =>(
                    <DesktopCard
                    key={project.id}
                    project={project}
                    onClick={() => setSelectedProject(project)}/>
                ))
            }
            {/* {
                selectedProject &&
                <DesktopModal 
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            } */}
        </div>
    )
}

export default main