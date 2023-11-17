import Fastify from 'fastify';

import { config } from './libs/packages/config/config.js';
import { logger } from './libs/packages/logger/logger.js';
import { database } from './libs/packages/database/database.js';
import { User } from '@prisma/client';

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

const addUser = async (email: string, hash: string): Promise<User> => {
  try {
    const newUser = await database.user.create({ data: { email, hash } });

    logger.info(`User created: ${JSON.stringify(newUser)}`);

    return newUser;
  } catch (error) {
    logger.error(`Error creating user: ${error}`);
    throw error; // Re-throw the error to handle it at a higher level
  }
};

server.get('/add-user', async (request, reply) => {
  const user = await addUser('Vasya', '123');

  return { user: user };
});

server.listen({ port: config.ENV.APP.PORT }, (error, address) => {
  if (error) {
    server.log.error(error);
    process.exit(1);
  }
});
