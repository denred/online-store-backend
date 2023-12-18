import { type CreateOrderPayload } from './create-order-payload.type.js';

type UpdateOrderPayload = CreateOrderPayload & { orderId: string };

export { type UpdateOrderPayload };
