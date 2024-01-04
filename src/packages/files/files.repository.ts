import { type File, type PrismaClient } from '@prisma/client';

import { type IRepository } from '~/libs/interfaces/interfaces.js';

import { type CreateFileDto } from './libs/types/types.js';

class FilesRepository implements IRepository {
  private db: Pick<PrismaClient, 'file'>;

  public constructor(database: Pick<PrismaClient, 'file'>) {
    this.db = database;
  }

  public async findAll(): Promise<File[]> {
    return this.db.file.findMany();
  }

  public async findById(id: string): Promise<File[]> {
    return this.db.file.findMany({ where: { id } });
  }

  public async find(payload: Partial<File>): Promise<File[]> {
    return this.db.file.findMany({ where: payload });
  }

  public async create(payload: CreateFileDto): Promise<File> {
    return this.db.file.create({ data: payload });
  }

  public async update(id: string, payload: Partial<File>): Promise<File> {
    return this.db.file.update({
      where: { id },
      data: payload,
    });
  }

  public async delete(id: string): Promise<boolean> {
    return !!(await this.db.file.delete({ where: { id } }));
  }
}

export { FilesRepository };
