import type { Project } from "@/data/types/project";
interface ProjectsResponse {
    message: string;
    data: Project[];
}
export async function getProjects(type: string): Promise<Project[]> {

    const response = await fetch(
        `http://localhost:3000/api/projects/type/${type.toLowerCase()}`
    );

    const result: ProjectsResponse = await response.json();
    if (!response.ok) {
        throw new Error("Erro ao buscar projetos");
    }

    return result.data;
}