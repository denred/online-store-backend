import { type ValueOf } from '~/libs/types/types.js';
import { type AuthStrategy } from '~/packages/auth/auth.js';

type DefaultStrategies =
  | ValueOf<typeof AuthStrategy>
  | ValueOf<typeof AuthStrategy>[]
  | undefined;

export { type DefaultStrategies };
