import { type OrderItem } from '@prisma/client';

import { type ProductsService } from '~/packages/products/products.js';

const getMappedOrderItems = async (
  orderItems: Pick<OrderItem, 'productId' | 'quantity'>[],
  productService: ProductsService,
): Promise<{ price: number; quantity: number }[]> => {
  const items: { price: number; quantity: number }[] = [];

  for (const orderItem of orderItems) {
    const { productId, quantity } = orderItem;
    const product = await productService.findById(productId);

    if (product) {
      items.push({ price: product.price, quantity });
    }
  }

  return items;
};

const getOrderTotalPrice = async (
  orderItems: Pick<OrderItem, 'productId' | 'quantity'>[],
  productService: ProductsService,
): Promise<number> => {
  const mappedOrderItems = await getMappedOrderItems(
    orderItems,
    productService,
  );

  return mappedOrderItems.reduce(
    (totalPrice: number, orderItem: { price: number; quantity: number }) =>
      totalPrice + orderItem.price * orderItem.quantity,
    0,
  );
};

export { getOrderTotalPrice };
