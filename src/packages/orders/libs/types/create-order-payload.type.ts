import { type OrderItem } from '@prisma/client';

type CreateOrderPayload = {
  userId: string;
  totalPrice: number;
  orderItems: Pick<OrderItem, 'productId' | 'quantities'>[];
};

export { type CreateOrderPayload };
