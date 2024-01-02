import {
  type Credentials,
  type LoginTicket,
  OAuth2Client,
  type TokenPayload,
} from 'google-auth-library';

import { HttpError } from '~/libs/exceptions/exceptions.js';

import { HttpMessage } from '../http/http.js';

type Constructor = {
  clientId: string;
  clientSecret: string;
};

class GoogleAuthClient {
  private authClient: OAuth2Client;

  private clientId: string;

  public constructor({ clientId, clientSecret }: Constructor) {
    this.clientId = clientId;
    this.authClient = new OAuth2Client(clientId, clientSecret);
  }

  private async getTokens(code: string): Promise<Credentials> {
    const { tokens } = await this.authClient.getToken(code);

    return tokens;
  }

  private async verify(token: string): Promise<LoginTicket> {
    return await this.authClient.verifyIdToken({
      idToken: token,
      audience: this.clientId,
    });
  }

  public async getUserInfo(code: string): Promise<TokenPayload | undefined> {
    try {
      const tokens = await this.getTokens(code);

      if (!tokens || !tokens.id_token) {
        throw new HttpError({ message: HttpMessage.INVALID_GOOGLE_TOKEN });
      }

      const ticket = await this.verify(tokens.id_token);

      return ticket.getPayload();
    } catch (error) {
      throw new HttpError({ message: (error as Error).message });
    }
  }
}

export { GoogleAuthClient };
