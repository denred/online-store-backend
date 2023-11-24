import { type ServerErrorType } from '../enums/enums.js';

type ServerValidationErrorResponse = {
  errorType: typeof ServerErrorType.VALIDATION;
  message: string;
};

type ServerCommonErrorResponse = {
  errorType: typeof ServerErrorType.COMMON;
  message: string;
};

type ServerErrorResponse =
  | ServerValidationErrorResponse
  | ServerCommonErrorResponse;

export {
  type ServerCommonErrorResponse,
  type ServerErrorResponse,
  type ServerValidationErrorResponse,
};
