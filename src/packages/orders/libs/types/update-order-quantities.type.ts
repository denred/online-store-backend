import { Size } from '@prisma/client';

type UpdateOrderQuantities = {
  productQuantities: Record<Size, number>;
  orderQuantities: Record<Size, number>;
  existingOrderQuantities?: Record<Size, number>;
};

export { type UpdateOrderQuantities };
