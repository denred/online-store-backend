import { type User } from '@prisma/client';

type UserSignUpRequestDTO = Pick<
  User,
  'firstName' | 'lastName' | 'phone' | 'email'
> & { password: string };

export { type UserSignUpRequestDTO };
