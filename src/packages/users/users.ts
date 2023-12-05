import { database, encrypt } from '~/libs/packages/packages.js';

import { UsersRepository } from './users.repository.js';
import { UsersService } from './users.service.js';

const usersRepository = new UsersRepository(database);
const usersService = new UsersService(usersRepository, encrypt);

export { usersService };
export { userCreateCommonValidationSchema } from './libs/validations/validations.js';
export { type UsersService } from './users.service.js';
