import { type AppEnvironment } from '~/libs/enums/enums.js';
import { type ValueOf } from '~/libs/types/value-of.type.js';

type EnvironmentSchema = {
  APP: {
    PORT: number;
    ENVIRONMENT: ValueOf<typeof AppEnvironment>;
  };
};

export { type EnvironmentSchema };
