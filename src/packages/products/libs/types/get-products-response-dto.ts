import { type Product } from '@prisma/client';

type GetProductsResponseDto = { products: Product[]; pages: number };

export { type GetProductsResponseDto };
