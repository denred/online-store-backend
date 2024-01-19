import { type Address, type User } from '@prisma/client';

type CreateUserDTO = Omit<User, 'id' | 'createdAt' | 'updatedAt'> & {
  addresses?: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[];
};

export { type CreateUserDTO };
