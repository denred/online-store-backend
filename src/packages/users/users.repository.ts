import { type PrismaClient, type User } from '@prisma/client';

import { type IRepository } from '~/libs/interfaces/interfaces.js';

import { type CreateUserDTO, type UpdateUserDTO } from './libs/types/types.js';

class UsersRepository implements IRepository {
  private db: Pick<PrismaClient, 'user' | 'address'>;

  public constructor(database: Pick<PrismaClient, 'user' | 'address'>) {
    this.db = database;
  }

  public async findById(id: string): Promise<User | null> {
    return await this.db.user.findUnique({
      where: { id },
      include: { addresses: true },
    });
  }

  public async findUserByEmailOrPhone({
    email,
    phone,
  }: {
    email?: User['email'];
    phone?: User['phone'];
  }): Promise<User | null> {
    return await this.db.user.findFirst({
      where: {
        OR: [
          {
            email,
          },
          {
            phone,
          },
        ],
      },
    });
  }

  public async create(payload: CreateUserDTO): Promise<User> {
    const { addresses, ...user } = payload;

    return await this.db.user.create({
      data: {
        ...user,
        addresses: addresses && { createMany: { data: addresses } },
      },
    });
  }

  public async update(
    id: string,
    payload: Partial<UpdateUserDTO>,
  ): Promise<User> {
    const { addresses, ...user } = payload;

    const updateData = {
      ...user,
      ...(addresses &&
        !addresses.every((it) => it === undefined) && {
          addresses: {
            updateMany: addresses.map((address) => ({
              where: { userId: id },
              data: address,
            })),
          },
        }),
    };

    return await this.db.user.update({
      where: { id },
      data: updateData,
    });
  }

  public async delete(id: string): Promise<boolean> {
    await this.db.address.deleteMany({
      where: {
        userId: id,
      },
    });

    return !!(await this.db.user.delete({ where: { id } }));
  }
}

export { UsersRepository };
