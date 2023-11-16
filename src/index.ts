import Fastify from 'fastify';

const server = Fastify();

server.get('/ping', async (request, reply) => {
  return { msg: 'Hello' };
});

server.listen({ port: 3333 }, (error, address) => {
  if (error) {
    console.error(error);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
