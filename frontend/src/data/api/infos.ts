import type { infos } from "@/data/types/infos";
interface infosResponse {
    message: string;
    data: infos[];
}
export async function getInfos(): Promise<infos[]> {

    const response = await fetch(
        `http://localhost:3000/api/infos`
    );

    const result: infosResponse = await response.json();
    if (!response.ok) {
        throw new Error("Erro ao buscar infos do cliente");
    }

    return result.data;
}