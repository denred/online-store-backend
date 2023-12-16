type JwtPayload = {
  iss?: string;
  exp?: number;
  iat?: number;
  [propName: string]: unknown;
};

export { type JwtPayload };
