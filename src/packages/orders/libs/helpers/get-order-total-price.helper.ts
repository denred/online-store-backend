import { Size, type OrderItem } from '@prisma/client';
import { getQuantity } from '~/packages/products/products.js';

import { productsService } from '~/packages/products/products.js';

const getOrderTotalPrice = async (
  orderItems: Pick<OrderItem, 'productId' | 'quantities'>[],
): Promise<number> => {
  let totalPrice = 0;

  for (const { productId, quantities } of orderItems) {
    const product = await productsService.findById(productId);

    if (product) {
      totalPrice +=
        product.price * getQuantity(quantities as Record<Size, number>);
    }
  }

  return totalPrice;
};

export { getOrderTotalPrice };
