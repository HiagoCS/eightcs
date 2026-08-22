import type { FastifyInstance } from "fastify";
const {sqlite} = require("../../../db/index");

async function links(fastify: FastifyInstance) {
    fastify.get("/pages", async () => {
        const pages = sqlite.prepare(`
            SELECT * 
            FROM navbar_links`).all();
        return {
            message: "Successful Request",
            data:pages
        };
    });
    fastify.get("/icons", async () => {
        const icons = sqlite.prepare(`
            SELECT * 
            FROM icons_links`).all();
        return {
            message: "Successful Request",
            data:icons
        };
    });
}

module.exports = (links);