import Fastify = require("fastify");
import cors = require("@fastify/cors");
const getRoute = require("./routes/get/index");


const server = Fastify({
    logger: true
});
server.register(cors, {origin:true})
server.register(getRoute, {prefix:"/api"});


server.listen({
    port: 3000,
    host:"localhost"
});