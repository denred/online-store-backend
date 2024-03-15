import { config } from '../config/config.js';
import { FacebookAuth } from './facebook-auth.package.js';

const { APP_SECRET: appSecret, APP_ID: appId } = config.ENV.FB;
const facebookAuth = new FacebookAuth({ appSecret, appId });

export { facebookAuth };
export { type IFacebookAuth } from './libs/interfaces';
