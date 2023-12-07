import { type OrderItem } from '@prisma/client';

import { productsService } from '~/packages/products/products.js';

const getOrderTotalPrice = async (
  orderItems: Pick<OrderItem, 'productId' | 'quantity'>[],
): Promise<number> => {
  let totalPrice = 0;

  for (const orderItem of orderItems) {
    const { productId, quantity } = orderItem;
    const product = await productsService.findById(productId);

    if (product) {
      totalPrice += product.price * quantity;
    }
  }

  return totalPrice;
};

export { getOrderTotalPrice };
