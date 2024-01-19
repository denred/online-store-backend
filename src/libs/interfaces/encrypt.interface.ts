import { type HashedPassword } from '~/packages/auth/auth.js';

interface IEncrypt {
  generate(password: string): Promise<HashedPassword>;
  compare(password: string, hash: string): Promise<boolean>;
}

export { type IEncrypt };
