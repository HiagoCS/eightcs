import Fastify = require("fastify");
import cors = require("@fastify/cors");
import path = require("node:path");
import fastifyStatic = require("@fastify/static");
const getRoute = require("./routes/get/index");

const server = Fastify({
    logger: true
});
server.register(cors, {origin:true})
server.register(getRoute, {prefix:"/api"});
server.register(fastifyStatic, {
    root: path.join(process.cwd(), "storage"),
    prefix: "/storage/",
});

server.listen({
    port: 3000,
    host:"localhost"
});