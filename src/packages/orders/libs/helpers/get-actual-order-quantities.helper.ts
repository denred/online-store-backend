import { type Size } from '@prisma/client';
import { type UpdateOrderQuantities } from '../types/types';

const getActualOrderQuantities = ({
  productQuantities,
  orderQuantities,
  existingOrderQuantities,
}: UpdateOrderQuantities): Record<Size, number> => {
  const actualOrderQuantities: Record<Size, number> = { ...productQuantities };

  for (const key of Object.keys(orderQuantities) as Size[]) {
    actualOrderQuantities[key] -=
      (orderQuantities?.[key] ?? 0) - (existingOrderQuantities?.[key] ?? 0);
  }

  return actualOrderQuantities;
};

export { getActualOrderQuantities };
