import type { FastifyInstance } from "fastify";
const { sqlite } = require("../../../db/index");
import path = require("node:path");
import fs = require("node:fs/promises");

async function links(fastify: FastifyInstance) {
    fastify.get("/pages/all", async (request, reply) => {
        const rows = sqlite.prepare(`
            SELECT p.type_id FROM navbar_links p`).all();
        return reply.code(200).send({
            message: "Successful Request",
            data: rows
        });
    });
    fastify.get("/pages", async (request, reply) => {
    const rows = sqlite.prepare(`
        SELECT 
            p.id,
            p.label,
            p.function,
            p.url,
            p.type_id AS page_type_id,

            hc.id AS card_id,
            hc.title AS card_title,
            hc.text AS card_text,
            hc.class AS card_class,
            hc.icon AS card_icon,
            hc.link_id AS card_link_id,
            hc.type_id AS card_type_id

        FROM navbar_links p

        LEFT JOIN home_cards hc
            ON hc.link_id = p.id

        ORDER BY p.id, hc.id
    `).all();

    if (rows.length === 0) {
        return reply.code(200).send({
            message: "Nenhuma pagina encontrada",
            data: []
        });
    }

    const pages: any[] = [];

    for (const row of rows) {
        let page = pages.find(
            (page) => page.id === row.id
        );

        if (!page) {
            page = {
                id: row.id,
                label: row.label,
                function: row.function,
                url: row.url,

                // type_id da navbar_links
                typeId: row.page_type_id,

                card: {}
            };

            pages.push(page);
        }

        if (row.card_id !== null) {
            page.card = {
                id: row.card_id,
                title: row.card_title,
                text: row.card_text,
                class: row.card_class,
                icon: row.card_icon,

                link_id: row.card_link_id,

                // type_id do home_cards
                type_id: row.card_type_id
            };
        }
    }

    return reply.code(200).send({
        message: "Successful Request",
        data: pages
    });
});
}

module.exports = (links);