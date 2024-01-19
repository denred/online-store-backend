import { type OrderItem } from '@prisma/client';

const getMappedOrderItems = (
  orderItems: OrderItem[],
): Pick<OrderItem, 'productId' | 'quantity'>[] =>
  orderItems.map(({ productId, quantity }) => ({
    productId,
    quantity,
  }));

export { getMappedOrderItems };
