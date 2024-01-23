import { type User } from '@prisma/client';

type UserSignResponseDTO = Omit<User, 'hash' | 'salt' | 'status'>;

export { type UserSignResponseDTO };
