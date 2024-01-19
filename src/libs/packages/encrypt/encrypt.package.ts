import * as bcrypt from 'bcrypt';

import { type IEncrypt } from '~/libs/interfaces/interfaces.js';
import { type HashedPassword } from '~/packages/auth/auth.js';

const SALT_ROUNDS = 10;

class Encrypt implements IEncrypt {
  public async generate(password: string): Promise<HashedPassword> {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);

    return { salt, hash };
  }

  public async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}

export { Encrypt };
