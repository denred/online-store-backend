import Fastify from 'fastify';

const server = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
    },
    serializers: {
      res(reply) {
        return {
          statusCode: reply.statusCode,
          headers:
            typeof reply.getHeaders === 'function' ? reply.getHeaders() : {},
        };
      },
    },
  },
});

server.get('/ping', async (request, reply) => {
  return { msg: 'Hello' };
});

server.listen({ port: 3333 }, (error, address) => {
  if (error) {
    server.log.error(error);
    process.exit(1);
  }
});
