import "./style.scss"
import { useState } from "react";
import { useLocation } from 'react-router-dom';

import Card from "./cards/index"
import Modal from "./modal/index";
import { useProjects } from "@/data/hooks/useProjects";
export default function projectPage({type}) {
    const [selectedProject, setSelectedProject] = useState(null);
    const { data: projects, isLoading, error } = useProjects(type);
    if(isLoading && useLocation().pathname !== "/") return <p>Loading...</p>
    if(error && useLocation().pathname !== "/") return <p>{error.message}</p>
    if(!projects?.length) return (useLocation().pathname !== "/" ? <p>Nenhum projeto encontrado!</p> : null)
    
    return(
        <div className={`project ${type}`}>
            
            {
                
                projects.map((project) =>(
                    <Card
                    key={project.id}
                    project={project}
                    onClick={() => setSelectedProject(project)}/>
                ))
            }
            {
                selectedProject &&
                <Modal 
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            }
        </div>
    )
}