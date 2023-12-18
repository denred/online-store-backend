import { type User, UserRole } from '@prisma/client';
import { type FastifyReply, type FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { type ValidationError } from 'joi';

import { HttpHeader, HttpMessage } from '~/libs/packages/packages.js';

import { AuthStrategy } from './libs/enums/enums.js';
import { getUnauthorizedError } from './libs/helpers/helpers.js';
import { type AuthPluginOptions } from './libs/types/types.js';
import { jwtPayloadSchema } from './libs/validations/validations.js';

declare module 'fastify' {
  interface FastifyRequest {
    user?: Omit<User, 'hash' | 'salt'>;
  }
}

const authPlugin = fp<AuthPluginOptions>((fastify, options, done) => {
  const { usersService, jwtService } = options;

  fastify.decorateRequest('user', null);

  const verifyJwtStrategy =
    (isJwtRequired: boolean) =>
    async (
      request: FastifyRequest,
      _: FastifyReply,
      done: (error?: Error) => void,
    ): Promise<void> => {
      try {
        const token = request.headers[HttpHeader.AUTHORIZATION]
          ?.replace('Bearer', '')
          .trim();

        if (!token && isJwtRequired) {
          return done(getUnauthorizedError());
        }

        if (!token) {
          return;
        }

        const rawPayload = await jwtService.verify(token);

        const { error, value: payload } = jwtPayloadSchema.validate(
          rawPayload,
        ) as {
          error?: ValidationError | null;
          value?: { id: string } | undefined;
        };

        if (!payload) {
          return done(
            getUnauthorizedError({
              message: HttpMessage.INVALID_JWT,
              cause: error,
            }),
          );
        }

        const user = await usersService.findById(payload.id);

        if (!user) {
          return done(
            getUnauthorizedError({ message: HttpMessage.INVALID_JWT }),
          );
        }

        request.user = user;
      } catch (error) {
        return done(getUnauthorizedError({ cause: error }));
      }
    };

  const verifyStatus =
    (role: UserRole) =>
    async (
      request: FastifyRequest,
      _: FastifyReply,
      done: (error?: Error) => void,
    ): Promise<void> => {
      if (!request?.user || request.user.role !== role) {
        return done(getUnauthorizedError());
      }
    };

  fastify.decorate(AuthStrategy.INJECT_USER, verifyJwtStrategy(false));
  fastify.decorate(AuthStrategy.VERIFY_JWT, verifyJwtStrategy(true));
  fastify.decorate(AuthStrategy.VERIFY_ADMIN, verifyStatus(UserRole.ADMIN));

  done();
});

export { authPlugin };
