import { config } from '~/libs/packages/config/config.js';

const buildDebugTokenURL = (
  token: string,
  appId: string,
  appSecret: string,
): URL => {
  const queryParams = `/debug_token?input_token=${token}&access_token=${appId}|${appSecret}`;

  return new URL(queryParams, config.ENV.FB.BASE_URL);
};

export { buildDebugTokenURL };
