import { type User } from '@prisma/client';

type UserRegisterModel = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

export { type UserRegisterModel };
