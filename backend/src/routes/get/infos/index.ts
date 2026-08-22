import type { FastifyInstance } from "fastify";
const {sqlite} = require("../../../db/index");

async function infos(fastify: FastifyInstance) {
    fastify.get("/infos", async () => {
        const infos = sqlite.prepare(`SELECT * FROM infos WHERE id = 1`).get();
        return {
            message: "Successful Request",
            data:infos
        };
    })
}

module.exports = (infos);