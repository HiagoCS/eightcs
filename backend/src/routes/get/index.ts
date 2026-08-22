import type { FastifyInstance } from "fastify";

const infos = require("./infos/index");
const projects = require("./projects/index");
const links = require("./navbar_links/index");

async function get(fastify: FastifyInstance) {
    fastify.get("/", async () => {
        return {
            message: "EightCS API funcionando!"
        };
    });
    await infos(fastify);
    await projects(fastify);
    await links(fastify);
}

module.exports = (get);