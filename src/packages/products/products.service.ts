import { type IService } from '~/libs/interfaces/interfaces.js';

class ProductsService implements IService {
  public findById(id: unknown, metadata?: unknown): Promise<unknown> {
    throw new Error('Method not implemented.');
  }

  public create(payload: unknown): Promise<unknown> {
    throw new Error('Method not implemented.');
  }

  public update(id: unknown, payload: unknown): Promise<unknown> {
    throw new Error('Method not implemented.');
  }

  public delete(id: unknown, metadata?: unknown): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
