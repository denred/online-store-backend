import { createSecretKey } from 'node:crypto';

import * as jose from 'jose';

import { type IJwtService } from './libs/interfaces/interfaces.js';
import { type JwtPayload } from './libs/types/types.js';

type Constructor = { secret: string; issuer: string; expTime: string };

class JwtService implements IJwtService {
  private secretKey: ReturnType<typeof createSecretKey>;

  private issuer: string;

  private expTime: string;

  public constructor({ secret, issuer, expTime }: Constructor) {
    this.issuer = issuer;
    this.expTime = expTime;
    this.secretKey = createSecretKey(secret, 'utf8');
  }

  public async sign(payload: Record<string, unknown>): Promise<string> {
    const alg = 'HS256';

    return await new jose.SignJWT(payload)
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setIssuer(this.issuer)
      .setExpirationTime(this.expTime)
      .sign(this.secretKey);
  }

  public async verify(token: string): Promise<JwtPayload> {
    const { payload } = await jose.jwtVerify(token, this.secretKey, {
      issuer: this.issuer,
    });

    return payload;
  }
}

export { JwtService };
