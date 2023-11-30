import {
  type Order,
  type OrderItem,
  type Prisma,
  type PrismaClient,
} from '@prisma/client';
import { type DefaultArgs } from '@prisma/client/runtime/library.js';

import { HttpError } from '~/libs/exceptions/http-error.exception.js';
import { HttpCode } from '~/libs/packages/http/http.js';

import { OrderErrorMessage } from './libs/enums/enums.js';
import {
  type CreateOrderPayload,
  type UpdateOrderPayload,
} from './libs/types/types.js';

class OrdersRepository {
  private db: Pick<PrismaClient, 'order' | '$transaction' | 'product'>;

  public constructor(
    database: Pick<PrismaClient, 'order' | '$transaction' | 'product'>,
  ) {
    this.db = database;
  }

  private async updateProductQuantity({
    tx,
    orderItem,
    existingOrderItems,
    deletionFlag,
  }: {
    tx: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$transaction' | '$on' | '$connect' | '$disconnect' | '$use' | '$extends'
    >;
    orderItem: Pick<OrderItem, 'productId' | 'quantity'>;
    existingOrderItems?: OrderItem[];
    deletionFlag?: true;
  }): Promise<void> {
    const { productId, quantity } = orderItem;
    const existingProduct = await tx.product.findUnique({
      where: { id: productId },
    });

    const { quantity: existingOrderQuantity = 0 } =
      existingOrderItems?.find((it) => it.productId === productId) ?? {};

    if (
      !existingProduct ||
      existingProduct.quantity < Math.max(quantity - existingOrderQuantity, 0)
    ) {
      throw new HttpError({
        status: HttpCode.FORBIDDEN,
        message: `Insufficient quantity for product ${productId}`,
      });
    }

    const difference = Math.abs(quantity - existingOrderQuantity);
    const isDecrement = quantity > existingOrderQuantity;

    isDecrement && !deletionFlag
      ? await tx.product.update({
          where: { id: productId },
          data: { quantity: { decrement: difference } },
        })
      : await tx.product.update({
          where: { id: productId },
          data: { quantity: { increment: difference } },
        });
  }

  public async createOrder(payload: CreateOrderPayload): Promise<Order> {
    const { userId, totalPrice, orderItems } = payload;

    return await this.db.$transaction(
      async (tx) => {
        const order = await tx.order.create({
          data: {
            userId,
            totalPrice,
            orderItems: {
              createMany: {
                data: [...orderItems],
              },
            },
          },
          include: {
            orderItems: true,
          },
        });

        for (const orderItem of orderItems) {
          await this.updateProductQuantity({ tx, orderItem });
        }

        return order;
      },
      {
        maxWait: 5000,
        timeout: 10_000,
      },
    );
  }

  public async getOrderById(
    orderId: string,
  ): Promise<(Order & { orderItems: OrderItem[] }) | null> {
    return await this.db.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true },
    });
  }

  public async updateOrder(payload: UpdateOrderPayload): Promise<Order> {
    const { orderId, userId, totalPrice, orderItems } = payload;

    const existingOrder = await this.getOrderById(orderId);

    if (!existingOrder) {
      throw new HttpError({
        status: HttpCode.NOT_FOUND,
        message: OrderErrorMessage.NOT_FOUND,
      });
    }

    const { orderItems: existingOrderItems } = existingOrder;

    return await this.db.$transaction(
      async (tx) => {
        const order = await tx.order.update({
          where: { id: orderId },
          data: {
            userId,
            totalPrice,
            orderItems: {
              createMany: {
                data: [...orderItems],
              },
            },
          },
          include: {
            orderItems: true,
          },
        });

        for (const orderItem of orderItems) {
          await this.updateProductQuantity({
            tx,
            orderItem,
            existingOrderItems,
          });
        }

        return order;
      },
      {
        maxWait: 5000,
        timeout: 10_000,
      },
    );
  }

  public async deleteOrder(orderId: string): Promise<boolean> {
    const deletedOrder = await this.db.$transaction(async (tx) => {
      const order = await this.getOrderById(orderId);

      if (!order) {
        throw new HttpError({
          status: HttpCode.NOT_FOUND,
          message: OrderErrorMessage.NOT_FOUND,
        });
      }

      const { orderItems } = order;

      for (const orderItem of orderItems) {
        await this.updateProductQuantity({ tx, orderItem, deletionFlag: true });
      }

      return await tx.order.delete({
        where: { id: orderId },
      });
    });

    return !!deletedOrder;
  }
}

export { OrdersRepository };
