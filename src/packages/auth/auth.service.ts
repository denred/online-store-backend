import { HttpError } from '~/libs/exceptions/exceptions.js';
import { HttpCode, HttpMessage } from '~/libs/packages/http/http.js';
import { type IJwtService } from '~/libs/packages/packages.js';

import { type UsersService } from '../users/users.service.js';
import { getUnauthorizedError } from './libs/helpers/helpers.js';
import {
  type UserSignInRequestDTO,
  type UserSignResponseWithToken,
  type UserSignUpRequestDTO,
} from './libs/types/types.js';

class AuthService {
  private usersService: UsersService;

  private jwtService: IJwtService;

  public constructor(usersService: UsersService, jwtService: IJwtService) {
    this.usersService = usersService;
    this.jwtService = jwtService;
  }

  public async signup(
    payload: UserSignUpRequestDTO,
  ): Promise<UserSignResponseWithToken> {
    const { phone, email } = payload;

    const existingUserByEmail = await this.usersService.findUserByEmailOrPhone({
      email,
    });

    if (existingUserByEmail) {
      throw new HttpError({
        message: HttpMessage.USER_EMAIL_EXISTS,
        status: HttpCode.CONFLICT,
      });
    }

    const existingUserByPhone = await this.usersService.findUserByEmailOrPhone({
      phone,
    });

    if (existingUserByPhone) {
      throw new HttpError({
        message: HttpMessage.USER_PHONE_EXISTS,
        status: HttpCode.CONFLICT,
      });
    }

    const user = await this.usersService.registerNewUser(payload);
    const token = await this.jwtService.sign({ id: user.id });

    return { ...user, token };
  }

  public async signin(
    credentials: UserSignInRequestDTO,
  ): Promise<UserSignResponseWithToken> {
    const { email, password } = credentials;

    const user = await this.usersService.findUserByEmailOrPhone({
      email,
    });

    if (!user) {
      throw getUnauthorizedError({ message: HttpMessage.WRONG_EMAIL });
    }

    if (!user.hash) {
      throw getUnauthorizedError();
    }

    const isPasswordMatching = await this.usersService.comparePasswords(
      password,
      user.hash,
    );

    if (!isPasswordMatching) {
      throw getUnauthorizedError({ message: HttpMessage.WRONG_PASSWORD });
    }

    const token = await this.jwtService.sign({ id: user.id });

    return { ...user, token };
  }
}

export { AuthService };
