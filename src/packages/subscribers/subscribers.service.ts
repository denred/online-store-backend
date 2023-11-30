import { type Preferences } from '@prisma/client';

import { HttpError } from '~/libs/exceptions/exceptions.js';
import { HttpCode } from '~/libs/packages/http/http.js';

import { SubscriptionErrorMessage } from './libs/enums/enums.js';
import { type SubscriptionBody } from './libs/types/types.js';
import { type SubscribersRepository } from './subscribers.repository.js';

class SubscribersService {
  private subscribersRepository: SubscribersRepository;

  public constructor(subscribersRepository: SubscribersRepository) {
    this.subscribersRepository = subscribersRepository;
  }

  public async subscribe(payload: SubscriptionBody): Promise<boolean> {
    const { email, firstName = null, lastName = null, preferences } = payload;

    const subscription =
      await this.subscribersRepository.getSubscriptionByEmail(email);

    if (subscription) {
      throw new HttpError({
        status: HttpCode.BAD_REQUEST,
        message: SubscriptionErrorMessage.SUBSCRIPTION_EXIST,
      });
    }

    const subscribe = await this.subscribersRepository.subscribe({
      email,
      firstName,
      lastName,
    });

    const { id: subscriptionId } = subscribe;

    await this.subscribersRepository.createPreferences({
      receiveNewsletter: preferences?.receiveNewsletter ?? true,
      productUpdates: preferences?.productUpdates ?? true,
      subscriptionId,
    });

    return subscribe.email.length > 0;
  }

  public async unsubscribe(payload: SubscriptionBody): Promise<boolean> {
    const { email } = payload;

    return await this.subscribersRepository.unsubscribe(email);
  }

  public async getStatus(
    payload: SubscriptionBody,
  ): Promise<'SUBSCRIBE' | 'UNSUBSCRIBE'> {
    const { email } = payload;

    const subscription =
      await this.subscribersRepository.getSubscriptionByEmail(email);

    return subscription ? 'SUBSCRIBE' : 'UNSUBSCRIBE';
  }

  public async setPreferences(payload: SubscriptionBody): Promise<Preferences> {
    const { email, preferences } = payload;

    const subscription =
      await this.subscribersRepository.getSubscriptionByEmailWithPreferences(
        email,
      );

    if (!preferences || !subscription?.preferences) {
      throw new HttpError({
        message: SubscriptionErrorMessage.SUBSCRIPTION_NOT_FOUND,
        status: HttpCode.NOT_FOUND,
      });
    }

    const { id } = subscription.preferences;

    return await this.subscribersRepository.setPreferences(id, preferences);
  }
}

export { SubscribersService };
