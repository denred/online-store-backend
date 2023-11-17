import { type RouteParameters } from '../types/route-parameters.type.js';

interface IServerApp {
  addRoute(parameters: RouteParameters): void;
  addRoutes(parameters: RouteParameters[]): void;
}

export { type IServerApp };
