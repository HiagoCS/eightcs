export async function getProjects() {

    const response = await fetch(
        "http://localhost:3000/projects"
    );

    if (!response.ok) {
        throw new Error("Erro ao buscar projetos");
    }

    return response.json();
}