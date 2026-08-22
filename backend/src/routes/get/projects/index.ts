import type { FastifyInstance } from "fastify";
const { sqlite } = require("../../../db/index");

async function projects(fastify: FastifyInstance) {
    fastify.get("/projects", async (request, reply) => {
        const projects = sqlite.prepare(
            `SELECT *
             FROM project
             WHERE status = true`).all();
        if(projects.length === 0)
            return reply.code(404).send({
                message:"Sem Projetos",
                data:null
            });
        reply.code(200).send({
            message: "Successful Request",
            data: projects
        });
    });

    fastify.get("/projects/type/:id", async (request, reply) => {
        const { id } = request.params as { id: string };
        const projects = sqlite.prepare(
            `SELECT *
             FROM project
             WHERE status = true
             AND type_id = ${id}`).all();
        if(projects.length === 0)
            return reply.code(404).send({
                message:"Sem Projetos",
                data:null
            });
        reply.code(200).send({
            message: "Successful Request",
            data: projects
        });
    });

    fastify.get("/project/:id/modal/identifiers", async(request, reply) =>{
        const { id } = request.params as { id: string };
        const modals = sqlite.prepare(
            `SELECT modal.id as modal_id
             FROM modal
             INNER JOIN project ON modal.project_id = project.id
             WHERE project.id = ${id}`).all();
        const req = {
            "total": modals.length,
            "id_array": [] as number[]
        };
        modals.map((data: { modal_id: number }) =>{
            req["id_array"].push(data.modal_id);
        });
        
        if(modals.length === 0)
            return reply.code(404).send({
                message:"Sem Modals",
                data:null
            });
        reply.code(200).send({
            message: "Successful Request",
            data: req
        });
    });

    fastify.get("/project/:id/modal/:modal_id", async(request, reply) =>{
        const { id,  modal_id} = request.params as { id: string,  modal_id: string};
        const modal = sqlite.prepare(
            `SELECT project.title, modal.text, modal.extension
             FROM modal
             INNER JOIN project ON modal.project_id = project.id
             WHERE project.id = ${id}
             AND modal.id = ${modal_id}`).get();
        if(modal.length === 0)
            return reply.code(404).send({
                message:"Sem Modal Compativel",
                data:null
            });
        reply.code(200).send({
            message: "Successful Request",
            data: modal
        });
    });
}

module.exports = (projects);