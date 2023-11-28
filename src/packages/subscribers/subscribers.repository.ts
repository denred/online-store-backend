import {
  type Preferences,
  type PrismaClient,
  type Subscribe,
} from '@prisma/client';

class SubscribersRepository {
  private db: Pick<PrismaClient, 'subscribe' | 'preferences'>;

  public constructor(
    database: Pick<PrismaClient, 'subscribe' | 'preferences'>,
  ) {
    this.db = database;
  }

  public async setPreferences(
    payload: Omit<Preferences, 'id'>,
  ): Promise<Preferences> {
    return await this.db.preferences.create({ data: payload });
  }

  public async subscribe(payload: Omit<Subscribe, 'id'>): Promise<Subscribe> {
    return await this.db.subscribe.create({
      data: payload,
    });
  }
}

export { SubscribersRepository };
