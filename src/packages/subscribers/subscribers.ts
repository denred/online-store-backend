import { database } from '~/libs/packages/database/database.js';

import { SubscribersRepository } from './subscribers.repository.js';

const subscribersRepository = new SubscribersRepository(database);
