import { type Address, type OrderItem, type User } from '@prisma/client';

type CreateOrderDTO = {
  user: Pick<User, 'firstName' | 'lastName' | 'phone' | 'email'>;
  orderDelivery: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
  orderItems: Pick<OrderItem, 'productId' | 'quantity'>[];
};

export { type CreateOrderDTO };
