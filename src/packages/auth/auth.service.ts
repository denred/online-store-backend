import { HttpError } from '~/libs/exceptions/exceptions.js';
import { HttpCode, HttpMessage } from '~/libs/packages/http/http.js';
import {
  type IJwtService,
  type GoogleAuthClient,
} from '~/libs/packages/packages.js';

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

  private googleAuthClient: GoogleAuthClient;

  public constructor(
    usersService: UsersService,
    jwtService: IJwtService,
    googleAuthClient: GoogleAuthClient,
  ) {
    this.usersService = usersService;
    this.jwtService = jwtService;
    this.googleAuthClient = googleAuthClient;
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

    const { id, hash, salt, ...filteredUser } = user;
    const token = await this.jwtService.sign({ id });

    return { ...filteredUser, id, token };
  }

  public async loginWithGoogle(
    code: string,
  ): Promise<UserSignResponseWithToken> {
    const userInfo = await this.googleAuthClient.getUserInfo(code);

    if (!userInfo) {
      throw new HttpError({ message: HttpMessage.INVALID_CODE });
    }

    const { email } = userInfo;

    if (!email) {
      throw new HttpError({
        message: HttpMessage.INVALID_USER_INFO_NO_EMAIL,
      });
    }

    let user = await this.usersService.findUserByEmailOrPhone({ email });

    if (!user) {
      user = await this.usersService.createUserFromGoogleInfo(userInfo);
    }
    const { id, hash, salt, ...filteredUser } = user;
    const token = await this.jwtService.sign({ id });

    return { ...filteredUser, id, token };
  }
}

export { AuthService };
