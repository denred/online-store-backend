import { type JwtPayload } from '../types/types.js';

interface IJwtService {
  sign(payload: Record<string, unknown>): Promise<string>;
  verify(token: string): Promise<JwtPayload>;
}

export { type IJwtService };
