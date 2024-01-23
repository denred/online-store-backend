import { type User } from '@prisma/client';

type UserSignInRequestDTO = Pick<User, 'email'> & { password: string };

export { type UserSignInRequestDTO };
