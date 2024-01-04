import {
  type Preferences,
  type PrismaClient,
  type Subscription,
} from '@prisma/client';

import {
  type PreferencesBody,
  type SubscriptionWithPreferences,
} from './libs/types/types.js';

class SubscribersRepository {
  private db: Pick<
    PrismaClient,
    'subscription' | 'preferences' | '$transaction'
  >;

  public constructor(
    database: Pick<
      PrismaClient,
      'subscription' | 'preferences' | '$transaction'
    >,
  ) {
    this.db = database;
  }

  public async createPreferences(
    payload: Omit<Preferences, 'id'>,
  ): Promise<Preferences> {
    return this.db.preferences.create({ data: payload });
  }

  public async subscribe(
    payload: Omit<Subscription, 'id'>,
  ): Promise<Subscription> {
    return this.db.subscription.create({
      data: payload,
    });
  }

  public async unsubscribe(email: string): Promise<boolean> {
    let success = false;

    await this.db.$transaction(async (tx) => {
      await tx.subscription.delete({
        where: {
          email,
        },
      });

      await tx.preferences.deleteMany({
        where: {
          subscription: {
            email,
          },
        },
      });

      success = true;
    });

    return success;
  }

  public async getSubscriptionByEmail(
    email: string,
  ): Promise<Subscription | null> {
    return this.db.subscription.findUnique({ where: { email } });
  }

  public async getSubscriptionByEmailWithPreferences(
    email: string,
  ): Promise<SubscriptionWithPreferences | null> {
    return this.db.subscription.findUnique({
      where: { email },
      include: { preferences: true },
    });
  }

  public async setPreferences(
    id: string,
    preferences: PreferencesBody,
  ): Promise<Preferences> {
    return this.db.preferences.update({
      where: { id },
      data: preferences,
    });
  }
}

export { SubscribersRepository };
