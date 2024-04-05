import { type OrderItem } from '@prisma/client';

const getMappedOrderItems = (
  orderItems: OrderItem[],
): Pick<OrderItem, 'productId' | 'quantities'>[] =>
  orderItems.map(({ productId, quantities }) => ({
    productId,
    quantities,
  }));

export { getMappedOrderItems };
