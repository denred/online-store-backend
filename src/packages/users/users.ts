import { database } from '~/libs/packages/database/database.js';

import { UsersRepository } from './users.repository.js';
import { UsersService } from './users.service.js';

const usersRepository = new UsersRepository(database);
const usersService = new UsersService(usersRepository);

export { usersService };
export { type UsersService } from './users.service.js';
