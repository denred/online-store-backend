import { type Size } from '@prisma/client';
import { type UpdateOrderQuantities } from '../types/types.js';

const isProductAvailable = ({
  productQuantities,
  orderQuantities,
  existingOrderQuantities,
}: UpdateOrderQuantities): boolean => {
  for (const key of Object.keys(orderQuantities) as Size[]) {
    if (
      orderQuantities[key] >
      (productQuantities?.[key] ?? 0) + (existingOrderQuantities?.[key] ?? 0)
    ) {
      return false;
    }
  }

  return true;
};

export { isProductAvailable };
