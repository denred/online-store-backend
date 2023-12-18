import { type UserSignResponseDTO } from './user-sign-response-dto.type.js';

type UserSignResponseWithToken = UserSignResponseDTO & {
  token: string;
};

export { type UserSignResponseWithToken };
