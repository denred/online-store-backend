import { config } from '../config/config.js';
import { GoogleAuthClient } from './google-auth-client.package.js';

const {
  CLIENT_ID: clientId,
  CLIENT_SECRET: clientSecret,
  REDIRECT_URI: redirectUri,
} = config.ENV.GOOGLE_AUTH;

const googleAuthClient = new GoogleAuthClient({
  clientId,
  clientSecret,
  redirectUri,
});

export { googleAuthClient, type GoogleAuthClient };
