import { type User, UserRole, UserStatus } from '@prisma/client';

import { throwError } from '~/libs/exceptions/exceptions.js';
import { type IEncrypt, type IService } from '~/libs/interfaces/interfaces.js';
import { HttpCode } from '~/libs/packages/http/http.js';

import {
  type UserSignResponseDTO,
  type UserSignUpRequestDTO,
} from '../auth/libs/types/types.js';
import { UsersErrorMessage } from './libs/enums/enums.js';
import { type CreateUserDTO, type UpdateUserDTO } from './libs/types/types.js';
import { type UsersRepository } from './users.repository.js';

class UsersService implements IService {
  private usersRepository: UsersRepository;

  private encryptService: IEncrypt;

  public constructor(
    usersRepository: UsersRepository,
    encryptService: IEncrypt,
  ) {
    this.usersRepository = usersRepository;
    this.encryptService = encryptService;
  }

  public async findById(id: string): Promise<User | null> {
    return this.usersRepository.findById(id);
  }

  public async findUserByEmailOrPhone({
    email,
    phone,
  }: {
    email?: User['email'];
    phone?: User['phone'];
  }): Promise<User | null> {
    return this.usersRepository.findUserByEmailOrPhone({ email, phone });
  }

  public async create(payload: CreateUserDTO): Promise<User> {
    const { email, phone } = payload;

    const user = await this.findUserByEmailOrPhone({ email, phone });

    if (user && user.status !== UserStatus.ANONYMOUS) {
      throwError(UsersErrorMessage.ALREADY_EXISTS, HttpCode.FORBIDDEN);
    }

    return this.usersRepository.create(payload);
  }

  public async registerNewUser(
    payload: UserSignUpRequestDTO,
  ): Promise<UserSignResponseDTO> {
    const { password, ...user } = payload;
    const { hash: passHash, salt: passSalt } =
      await this.encryptService.generate(password);

    const { hash, salt, ...createdUser } = await this.usersRepository.create({
      ...user,
      hash: passHash,
      salt: passSalt,
      status: UserStatus.ACTIVE,
      role: UserRole.USER,
    });

    return createdUser;
  }

  public async comparePasswords(
    inputPassword: string,
    passwordHash: string,
  ): Promise<boolean> {
    return await this.encryptService.compare(inputPassword, passwordHash);
  }

  public async update(
    id: string,
    payload: Partial<UpdateUserDTO>,
  ): Promise<User> {
    const { email, phone, addresses } = payload;

    const existingUser = await this.findById(id);

    if (!existingUser) {
      throwError(UsersErrorMessage.NOT_FOUND, HttpCode.NOT_FOUND);
    }

    const userWithSameEmailOrPhone = await this.findUserByEmailOrPhone({
      email,
      phone,
    });

    if (userWithSameEmailOrPhone && userWithSameEmailOrPhone.id !== id) {
      throwError(UsersErrorMessage.ALREADY_EXISTS, HttpCode.FORBIDDEN);
    }

    return this.usersRepository.update(id, {
      ...payload,
      addresses,
    });
  }

  public async delete(id: string): Promise<boolean> {
    return this.usersRepository.delete(id);
  }
}

export { UsersService };
