import { Database } from './database.package.js';

const database = await Database.getInstance().getConnection();

export { database };
