import { serverInitializer } from '../build/index.js';

export default async (req, res) => {
  const app = await serverInitializer();

  app.server.emit('request', req, res);
};
