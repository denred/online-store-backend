import { Database } from './database.package.js';

const database = await Database.getInstance().getConnection();

export { database };
export { type Database } from './database.package.js';
