import { config } from '../config/config.js';
import { JwtService } from './jwt-service.package.js';

const jwt = new JwtService({
  secret: config.ENV.JWT.SECRET,
  issuer: config.ENV.JWT.ISSUER,
  expTime: config.ENV.JWT.EXP_TIME,
});

export { jwt };
export { type IJwtService } from './libs/interfaces/interfaces.js';
