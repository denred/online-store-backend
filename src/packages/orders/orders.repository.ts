import {
  type Size,
  type Order,
  type OrderItem,
  type Prisma,
  type PrismaClient,
} from '@prisma/client';
import { type DefaultArgs } from '@prisma/client/runtime/library.js';
import {
  type CreateOrderPayload,
  type UpdateOrderPayload,
} from './libs/types/types.js';

import { TransactionConfigParameters } from '~/libs/enums/enums.js';
import { throwError } from '~/libs/exceptions/exceptions.js';
import { HttpCode } from '~/libs/packages/http/http.js';
import { OrderErrorMessage } from './libs/enums/enums.js';
import {
  isProductAvailable,
  getActualOrderQuantities,
  getNegativeValues,
} from './libs/helpers/helpers.js';
import { getQuantity } from '../products/products.js';

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
  }: {
    tx: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$transaction' | '$on' | '$connect' | '$disconnect' | '$use' | '$extends'
    >;
    orderItem: Pick<OrderItem, 'productId' | 'quantities'>;
    existingOrderItems?: Pick<OrderItem, 'productId' | 'quantities'>[];
  }): Promise<void> {
    const { productId, quantities } = orderItem;

    const existingProduct = await tx.product.findUnique({
      where: { id: productId },
    });

    const { quantities: orderQuantities } =
      existingOrderItems?.find(({ productId: id }) => id === productId) || {};

    if (
      !existingProduct ||
      !isProductAvailable({
        productQuantities: existingProduct.quantities as Record<Size, number>,
        orderQuantities: quantities as Record<Size, number>,
        existingOrderQuantities:
          (orderQuantities as Record<Size, number>) || {},
      })
    ) {
      throwError(
        `Insufficient quantity for product ${productId}`,
        HttpCode.FORBIDDEN,
      );
    }

    const updatedProductQuantities = getActualOrderQuantities({
      productQuantities: existingProduct?.quantities as Record<Size, number>,
      orderQuantities: quantities as Record<Size, number>,
      existingOrderQuantities: (orderQuantities as Record<Size, number>) || {},
    });

    await tx.product.update({
      where: { id: productId },
      data: {
        quantities: updatedProductQuantities,
        quantity: getQuantity(updatedProductQuantities),
      },
    });
  }

  public createOrder(payload: CreateOrderPayload): Promise<Order> {
    const { userId, totalPrice, orderItems } = payload;

    return this.db.$transaction(
      async (tx) => {
        const updatedOrderItems: Pick<
          OrderItem,
          'productId' | 'quantities' | 'quantity'
        >[] = [];
        for (const orderItem of orderItems) {
          await this.updateProductQuantity({
            tx,
            orderItem,
          });
          updatedOrderItems.push({
            ...orderItem,
            quantity: getQuantity(orderItem.quantities as Record<Size, number>),
          });
        }

        return tx.order.create({
          data: {
            userId,
            totalPrice,
            orderItems: {
              createMany: {
                data: [...updatedOrderItems],
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
    const {
      orderId,
      userId,
      totalPrice,
      orderItems,
      existingOrderItems = [],
    } = payload;

    return this.db.$transaction(
      async (tx) => {
        await tx.orderItem.deleteMany({
          where: {
            orderId,
          },
        });

        for (const { productId, quantities } of existingOrderItems) {
          const updatedOrderItem = {
            productId,
            quantities: getNegativeValues<Size>(
              quantities as Record<Size, number>,
            ),
          };
          await this.updateProductQuantity({
            tx,
            orderItem: updatedOrderItem,
          });
        }

        await tx.orderItem.createMany({
          data: orderItems.map(({ productId, quantities }) => ({
            orderId,
            productId,
            quantity: getQuantity(quantities as Record<Size, number>),
            quantities,
          })),
        });

        for (const orderItem of orderItems) {
          await this.updateProductQuantity({
            tx,
            orderItem,
          });
        }

        return tx.order.update({
          where: { id: orderId },
          data: {
            userId,
            totalPrice,
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

      for (const { productId, quantities } of order?.orderItems ?? []) {
        const updatedOrderItem = {
          productId,
          quantities: getNegativeValues<Size>(
            quantities as Record<Size, number>,
          ),
        };

        await this.updateProductQuantity({
          tx,
          orderItem: updatedOrderItem,
        });
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
