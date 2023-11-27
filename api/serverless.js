import { serverInitializer } from '../build/libs/packages/server-app/server-app.js';

export default async (req, res) => {
  const app = await serverInitializer();
  app.server.emit('request', req, res);
};
