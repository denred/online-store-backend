import { type Colour, type Size } from '@prisma/client';

type GetFilteredProductRequestDto = {
  colures?: Colour[];
  sizes?: Size[];
  priceRange?: { min: number; max: number };
};

export { type GetFilteredProductRequestDto };
