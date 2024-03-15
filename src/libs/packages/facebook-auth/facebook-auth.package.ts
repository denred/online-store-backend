import { HttpError } from '~/libs/exceptions/exceptions.js';
import { buildDebugTokenURL } from './libs/helpers/helpers.js';
import { IFacebookAuth } from './libs/interfaces';
import { TokenResponse } from './libs/types';
import { HttpMessage } from '../http/http.js';

type Constructor = {
  appSecret: string;
  appId: string;
};

class FacebookAuth implements IFacebookAuth {
  private appSecret: string;
  private appId: string;

  public constructor({ appSecret, appId }: Constructor) {
    this.appSecret = appSecret;
    this.appId = appId;
  }

  public async verifyToken(accessToken: string): Promise<boolean> {
    try {
      const validationUrl = buildDebugTokenURL(
        accessToken,
        this.appId,
        this.appSecret,
      );
      const response = await fetch(validationUrl);
      const { data } = (await response.json()) as TokenResponse;

      return data.is_valid;
    } catch (error) {
      throw new HttpError({
        message: HttpMessage.INVALID_ACCESS_TOKEN,
      });
    }
  }
}

export { FacebookAuth };
