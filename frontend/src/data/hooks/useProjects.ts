import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/data/api/projects";

export function useProjects() {

    return useQuery({
        queryKey: ["projects"],
        queryFn: getProjects
    });

}