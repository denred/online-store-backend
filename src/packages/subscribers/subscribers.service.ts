import { type SubscribeBody } from './libs/types/types.js';
import { type SubscribersRepository } from './subscribers.repository.js';

class SubscribersService {
  private subscribersRepository: SubscribersRepository;

  public constructor(subscribersRepository: SubscribersRepository) {
    this.subscribersRepository = subscribersRepository;
  }

  public async subscribe(payload: SubscribeBody): Promise<boolean> {
    const { email, firstName = null, lastName = null, preferences } = payload;

    let preferencesId: string | null = null;

    if (preferences) {
      const { id } =
        await this.subscribersRepository.setPreferences(preferences);
      preferencesId = id;
    }

    const subscribe = await this.subscribersRepository.subscribe({
      email,
      firstName,
      lastName,
      preferencesId,
    });

    return subscribe.email.length > 0;
  }

  public async unsubscribe(payload: SubscribeBody): Promise<boolean> {
    return true;
  }

  public async getStatus(
    payload: SubscribeBody,
  ): Promise<'SUBSCRIBE' | 'UNSUBSCRIBE'> {
    return 'SUBSCRIBE';
  }

  public async setPreferences(payload: SubscribeBody): Promise<boolean> {
    return true;
  }
}

export { SubscribersService };
