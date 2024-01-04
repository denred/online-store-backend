import { HttpError } from '~/libs/exceptions/exceptions.js';
import { HttpCode, HttpMessage } from '~/libs/packages/http/http.js';

import { type UsersService } from '../users/users.service.js';
import {
  type UserSignUpRequestDTO,
  type UserSignUpResponseDTO,
} from './libs/types/types.js';

class AuthService {
  private usersService: UsersService;

  public constructor(usersService: UsersService) {
    this.usersService = usersService;
  }

  public async signup(
    payload: UserSignUpRequestDTO,
  ): Promise<UserSignUpResponseDTO> {
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

    return this.usersService.registerNewUser(payload);
  }
}

export { AuthService };
