interface IService<T = unknown> {
  findById(id: unknown, metadata?: unknown): Promise<T | null>;
  create(payload: unknown): Promise<T>;
  update(id: unknown, payload: unknown): Promise<T>;
  delete(id: unknown, metadata?: unknown): Promise<boolean>;
}

export { type IService };
