import { type User, UserStatus } from '@prisma/client';

import { HttpError } from '~/libs/exceptions/http-error.exception.js';
import { type IService } from '~/libs/interfaces/interfaces.js';
import { HttpCode } from '~/libs/packages/http/http.js';

import { UsersErrorMessage } from './libs/enums/enums.js';
import { type CreateUserDTO, type UpdateUserDTO } from './libs/types/types.js';
import { type UsersRepository } from './users.repository.js';

class UsersService implements IService {
  private usersRepository: UsersRepository;

  public constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository;
  }

  public async findById(id: string): Promise<User | null> {
    return await this.usersRepository.findById(id);
  }

  public async findUserByEmailOrPhone({
    email,
    phone,
  }: {
    email?: User['email'];
    phone?: User['phone'];
  }): Promise<User | null> {
    return await this.usersRepository.findUserByEmailOrPhone({ email, phone });
  }

  public async create(payload: CreateUserDTO): Promise<User> {
    const { email, phone } = payload;

    const user = await this.findUserByEmailOrPhone({ email, phone });

    if (user && user.status !== UserStatus.NOT_REGISTERED) {
      throw new HttpError({
        status: HttpCode.FORBIDDEN,
        message: UsersErrorMessage.ALREADY_EXISTS,
      });
    }

    return await this.usersRepository.create(payload);
  }

  public async update(
    id: string,
    payload: Partial<UpdateUserDTO>,
  ): Promise<User> {
    const { email, phone, addresses } = payload;

    const existingUser = await this.findById(id);

    if (!existingUser) {
      throw new HttpError({
        status: HttpCode.NOT_FOUND,
        message: UsersErrorMessage.NOT_FOUND,
      });
    }

    const userWithSameEmailOrPhone = await this.findUserByEmailOrPhone({
      email,
      phone,
    });

    if (userWithSameEmailOrPhone && userWithSameEmailOrPhone.id !== id) {
      throw new HttpError({
        status: HttpCode.FORBIDDEN,
        message: UsersErrorMessage.ALREADY_EXISTS,
      });
    }

    return await this.usersRepository.update(id, {
      ...payload,
      addresses: addresses,
    });
  }

  public async delete(id: string): Promise<boolean> {
    return await this.usersRepository.delete(id);
  }
}

export { UsersService };