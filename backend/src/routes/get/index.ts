import type { FastifyInstance } from "fastify";

const infos = require("./infos/index");
const projects = require("./projects/index");

async function get(fastify: FastifyInstance) {
    fastify.get("/", async () => {
        return {
            message: "EightCS API funcionando!"
        };
    });
    await infos(fastify);
    await projects(fastify);
}

module.exports = (get);