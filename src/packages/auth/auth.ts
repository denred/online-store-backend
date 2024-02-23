import {
  jwtService,
  logger,
  googleAuthClient,
} from '~/libs/packages/packages.js';
import { usersService } from '../users/users.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

const authService = new AuthService(usersService, jwtService, googleAuthClient);
const authController = new AuthController(logger, authService);

export { authController };
export { authPlugin } from './auth.plugin.js';
export { AuthStrategy } from './libs/enums/enums.js';
export { type HashedPassword } from './libs/types/types.js';
