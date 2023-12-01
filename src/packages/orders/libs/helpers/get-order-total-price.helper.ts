const getOrderTotalPrice = (
  orderItems: { price: number; quantity: number }[],
): number =>
  orderItems.reduce(
    (totalPrice: number, orderItem: { price: number; quantity: number }) =>
      totalPrice + orderItem.price * orderItem.quantity,
    0,
  );

export { getOrderTotalPrice };
