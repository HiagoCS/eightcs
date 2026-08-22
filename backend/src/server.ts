import Fastify = require("fastify");
const getRoute = require("./routes/get/index");


const server = Fastify({
    logger: true
});

server.register(getRoute, {prefix:"/api"});


server.listen({
    port: 3000
});