import {
  type Order,
  type OrderItem,
  type Prisma,
  type PrismaClient,
} from '@prisma/client';
import { type DefaultArgs } from '@prisma/client/runtime/library.js';

import { TransactionConfigParameters } from '~/libs/enums/enums.js';
import { throwError } from '~/libs/exceptions/exceptions.js';
import { HttpCode } from '~/libs/packages/http/http.js';

import { OrderErrorMessage } from './libs/enums/enums.js';
import {
  type CreateOrderPayload,
  type UpdateOrderPayload,
} from './libs/types/types.js';

class OrdersRepository {
  private db: Pick<
    PrismaClient,
    'order' | '$transaction' | 'product' | 'orderItem'
  >;

  public constructor(
    database: Pick<
      PrismaClient,
      'order' | '$transaction' | 'product' | 'orderItem'
    >,
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
    existingOrderItems?: Pick<OrderItem, 'productId' | 'quantity'>[];
    deletionFlag?: true;
  }): Promise<void> {
    const { productId, quantity } = orderItem;

    const existingProduct = await tx.product.findUnique({
      where: { id: productId },
    });

    const { quantity: existingOrderQuantity } = existingOrderItems?.find(
      (it) => it.productId === productId,
    ) ?? { quantity: 0 };

    if (
      !existingProduct ||
      existingProduct.quantity < Math.max(quantity - existingOrderQuantity, 0)
    ) {
      throwError(
        `Insufficient quantity for product ${productId}`,
        HttpCode.FORBIDDEN,
      );
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

  public createOrder(payload: CreateOrderPayload): Promise<Order> {
    const { userId, totalPrice, orderItems } = payload;

    return this.db.$transaction(
      async (tx) => {
        for (const orderItem of orderItems) {
          await this.updateProductQuantity({
            tx,
            orderItem,
          });
        }

        return tx.order.create({
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
      },
      {
        maxWait: TransactionConfigParameters.MAX_WAIT,
        timeout: TransactionConfigParameters.TIMEOUT,
      },
    );
  }

  public getOrderById(
    orderId: string,
  ): Promise<(Order & { orderItems: OrderItem[] }) | null> {
    return this.db.order.findUnique({
      where: { id: orderId },
      include: { orderItems: true },
    });
  }

  public updateOrder(payload: UpdateOrderPayload): Promise<Order> {
    const { orderId, userId, totalPrice, orderItems } = payload;

    return this.db.$transaction(
      async (tx) => {
        const existingOrder = await this.getOrderById(orderId);

        if (!existingOrder) {
          throwError(OrderErrorMessage.NOT_FOUND, HttpCode.NOT_FOUND);
        }

        const { orderItems: existingOrderItems } = existingOrder || {};

        for (const orderItem of orderItems) {
          await this.updateProductQuantity({
            tx,
            orderItem,
            existingOrderItems,
          });
        }

        return tx.order.update({
          where: { id: orderId },
          data: {
            userId,
            totalPrice,
            orderItems: {
              updateMany: orderItems.map(({ productId, quantity }) => ({
                where: { productId },
                data: { productId, quantity },
              })),
            },
          },
          include: {
            orderItems: true,
          },
        });
      },
      {
        maxWait: TransactionConfigParameters.MAX_WAIT,
        timeout: TransactionConfigParameters.TIMEOUT,
      },
    );
  }

  public async deleteOrder(orderId: string): Promise<boolean> {
    return !!(await this.db.$transaction(async (tx) => {
      const order = await this.getOrderById(orderId);

      if (!order) {
        throwError(OrderErrorMessage.NOT_FOUND, HttpCode.NOT_FOUND);
      }

      for (const orderItem of order?.orderItems ?? []) {
        await this.updateProductQuantity({ tx, orderItem, deletionFlag: true });
      }

      await tx.orderItem.deleteMany({
        where: {
          orderId,
        },
      });

      return tx.order.delete({
        where: { id: orderId },
      });
    }));
  }

  public getOrderItemsByOrderId(id: string): Promise<OrderItem[]> {
    return this.db.orderItem.findMany({ where: { orderId: id } });
  }
}

export { OrdersRepository };
