import { type Address, type User } from '@prisma/client';

type UpdateUserDTO = Pick<
  User,
  'firstName' | 'lastName' | 'phone' | 'email'
> & { addresses: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[] };

export { type UpdateUserDTO };
