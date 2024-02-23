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
  MAILER: {
    SENDGRID_API_KEY: string;
    SENDGRID_USER: string;
    SMTP_TLS: boolean;
    SENDGRID_SENDER_EMAIL: string;
  };
  JWT: {
    SECRET: string;
    ISSUER: string;
    EXP_TIME: string;
  };
  GOOGLE_AUTH: {
    CLIENT_ID: string;
    CLIENT_SECRET: string;
    REDIRECT_URI: string;
  };
};

export { type EnvironmentSchema };
