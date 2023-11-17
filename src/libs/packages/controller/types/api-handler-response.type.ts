import { type ValueOf } from '~/libs/types/types.js';

import { type HttpCode } from '../../http/enums/enums.js';

type ApiHandlerResponse<T = unknown> = {
  status: ValueOf<typeof HttpCode>;
  payload: T;
};

export { type ApiHandlerResponse };
