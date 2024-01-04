import { type Address, type OrderItem, type User } from '@prisma/client';

type UpdateOrderDTO = {
  user?: Partial<Pick<User, 'firstName' | 'lastName' | 'phone' | 'email'>>;
  orderDelivery?: Partial<
    Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  >;
  orderItems?: Pick<OrderItem, 'productId' | 'quantity'>[];
};

export { type UpdateOrderDTO };
