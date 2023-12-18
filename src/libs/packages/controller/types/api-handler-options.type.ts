import { type User } from '@prisma/client';

import { type DefaultApiHandlerOptions } from './default-api-handler-oprions.type.js';

type ApiHandlerOptions<
  T extends DefaultApiHandlerOptions = DefaultApiHandlerOptions,
> = {
  body: T['body'];
  query: T['query'];
  params: T['params'];
  hostname: T['hostname'];
  parsedFiles: T['parsedFiles'];
  user?: Omit<User, 'hash' | 'salt'>;
};

export { type ApiHandlerOptions };
