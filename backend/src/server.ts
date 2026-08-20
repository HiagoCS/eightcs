import Fastify = require("fastify");
const { db } = require("./db/index.js");

const server = Fastify({
    logger: true
});

server.get("/", async () => {
    return {
        message: "EightCS API funcionando!"
    };
});

server.listen({
    port: 3000
});