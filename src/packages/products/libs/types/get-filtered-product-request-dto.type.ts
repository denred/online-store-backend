import { type Colour, type Size } from '@prisma/client';

type GetFilteredProductRequestDto = {
  colours?: Colour[];
  sizes?: Size[];
  priceRange?: { min: number; max: number };
};

export { type GetFilteredProductRequestDto };
