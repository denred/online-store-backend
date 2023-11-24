import { type RouteParameters } from '../../server-app/types/types.js';
import { type ControllerRouteParameters } from '../types/types.js';

interface IController {
  routes: RouteParameters[];
  addRoute(options: ControllerRouteParameters): void;
}

export { type IController };
