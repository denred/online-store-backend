import { type RouteParameters } from '../types/types.js';

interface IServerAppApi {
  version: string;
  routes: RouteParameters[];
  buildFullPath(path: string): string;
  generateDoc(): object;
}

export { type IServerAppApi };
