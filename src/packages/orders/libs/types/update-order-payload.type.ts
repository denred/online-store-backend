import { type OrderItem } from '@prisma/client';

import { type CreateOrderPayload } from './create-order-payload.type.js';

type UpdateOrderPayload = CreateOrderPayload & {
  orderId: string;
  existingOrderItems: OrderItem[];
};

export { type UpdateOrderPayload };
