import { type User } from '@prisma/client';

type UserSignUpResponseDTO = Omit<User, 'hash' | 'salt' | 'status'>;

export { type UserSignUpResponseDTO };
