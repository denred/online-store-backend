import {
  type EnvironmentSchema,
  type IConfig,
  type IJwtService,
} from '~/libs/packages/packages.js';
import { type UsersService } from '~/packages/users/users.js';

type AuthPluginOptions = {
  config: IConfig<EnvironmentSchema>;
  usersService: UsersService;
  jwtService: IJwtService;
};

export { type AuthPluginOptions };
