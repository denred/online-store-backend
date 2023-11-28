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
    return await this.db.preferences.create({ data: payload });
  }

  public async subscribe(
    payload: Omit<Subscription, 'id'>,
  ): Promise<Subscription> {
    return await this.db.subscription.create({
      data: payload,
    });
  }

  public async unsubscribe(email: string): Promise<boolean> {
    let succes = false;

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

      succes = true;
    });

    return succes;
  }

  public async getSubscriptionByEmail(
    email: string,
  ): Promise<Subscription | null> {
    return await this.db.subscription.findUnique({ where: { email } });
  }

  public async getSubscriptionByEmailWithPrefernces(
    email: string,
  ): Promise<SubscriptionWithPreferences | null> {
    return await this.db.subscription.findUnique({
      where: { email },
      include: { preferences: true },
    });
  }

  public async setPreferences(
    id: string,
    preferences: PreferencesBody,
  ): Promise<Preferences> {
    return await this.db.preferences.update({
      where: { id },
      data: preferences,
    });
  }
}

export { SubscribersRepository };
