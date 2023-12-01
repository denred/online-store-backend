import { type Address, type User } from '@prisma/client';

type CreateUserDTO = Pick<
  User,
  'firstName' | 'lastName' | 'phone' | 'email'
> & { addresses: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[] };

export { type CreateUserDTO };
