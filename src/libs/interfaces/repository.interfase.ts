interface IRepository<T = unknown> {
  findById(id: string): Promise<T[]>;
  create(payload: unknown): Promise<T>;
  update(id: unknown, payload: unknown): Promise<T>;
  delete(id: unknown): Promise<boolean>;
}

export { type IRepository };
