import { type AppEnvironment } from '~/libs/enums/enums.js';
import { type ValueOf } from '~/libs/types/value-of.type.js';

type EnvironmentSchema = {
  APP: {
    PORT: number;
    ENVIRONMENT: ValueOf<typeof AppEnvironment>;
  };
  AWS: {
    SECRET_ACCESS_KEY: string;
    ACCESS_KEY_ID: string;
    S3: {
      BUCKET_NAME: string;
      REGION: string;
      SIGNED_URL_EXPIRES_IN_SECONDS: number;
    };
  };
};

export { type EnvironmentSchema };
