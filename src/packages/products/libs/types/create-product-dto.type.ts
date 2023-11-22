import { type Product } from '@prisma/client';

type CreateProductDto = Omit<Product, 'id' | 'files'> & {
  files: string[];
};

export { type CreateProductDto };
