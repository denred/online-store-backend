import { type FastifyReply, type FastifyRequest } from 'fastify';
import { type Schema as ValidationSchema } from 'joi';

import { type AuthStrategyHandler } from '../../controller/controller.js';
import { type HttpMethod } from '../../http/http.js';

type RouteParameters = {
  path: string;
  method: HttpMethod;
  authStrategy?: AuthStrategyHandler;
  handler: (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => Promise<void> | void;
  validation?: {
    body?: ValidationSchema;
    params?: ValidationSchema;
    query?: ValidationSchema;
  };
};

export { type RouteParameters };
