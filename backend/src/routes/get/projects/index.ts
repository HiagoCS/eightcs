import type { FastifyInstance } from "fastify";
const { sqlite } = require("../../../db/index");

async function projects(fastify: FastifyInstance) {
    fastify.get("/projects", async (request, reply) => {
        const projects = sqlite.prepare(
            `SELECT *
             FROM project
             WHERE status = true`).all();
        if (projects.length === 0)
            return reply.code(404).send({
                message: "Sem Projetos",
                data: null
            });
        reply.code(200).send({
            message: "Successful Request",
            data: projects
        });
    });

    fastify.get("/projects/type/:type", async (request, reply) => {
        const { type } = request.params as { type: string };

        const rows = sqlite.prepare(`
        SELECT
            p.id,
            p.title,
            p.description,
            p.external_url,
            p.type_id,
            p.status,

            m.id AS modal_id,
            m.project_id AS modal_project_id,
            m.text AS modal_text,
            m.extension AS modal_extension

        FROM project p

        INNER JOIN project_type pt
            ON p.type_id = pt.id

        LEFT JOIN modal m
            ON m.project_id = p.id

        WHERE pt.type = ?
        AND p.status = 1

        ORDER BY p.id, m.id
    `).all(type);

        if (rows.length === 0) {
            return reply.code(200).send({
                message: "Nenhum projeto encontrado",
                data: []
            });
        }

        const projects: any[] = [];
        let refactorModal = 1;
        for (const row of rows) {
            
            let project = projects.find(
                (project) => project.id === row.id
            );

            if (!project) {
                project = {
                    id: row.id,
                    title: row.title,
                    description: row.description,
                    externalUrl: row.external_url,
                    typeId: row.type_id,
                    status: Boolean(row.status),
                    modal: []
                };

                projects.push(project);
            }

            if (row.modal_id !== null) {
                project.modal.push({
                    id: refactorModal++,
                    project_id: row.modal_project_id,
                    text: row.modal_text,
                    extension: row.modal_extension
                });
            }
        }

        return reply.code(200).send({
            message: "Successful Request",
            data: projects
        });
    });
}

module.exports = (projects);