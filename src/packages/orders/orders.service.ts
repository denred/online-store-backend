import {
  type Address,
  type Order,
  type OrderItem,
  UserRole,
  UserStatus,
} from '@prisma/client';

import { HttpError } from '~/libs/exceptions/http-error.exception.js';
import { type IService } from '~/libs/interfaces/interfaces.js';
import { HttpCode } from '~/libs/packages/http/http.js';

import { type UsersService } from '../users/users.js';
import { OrderErrorMessage } from './libs/enums/enums.js';
import {
  getMappedOrderItems,
  getOrderTotalPrice,
} from './libs/helpers/helpers.js';
import {
  type CreateOrderDTO,
  type UpdateOrderDTO,
} from './libs/types/types.js';
import { type OrdersRepository } from './orders.repository.js';

// import { mailService } from '../mail/mail.js';
// import { OrderConfirmationView } from '../mail/libs/views/order-confirmation/order-confirmation.view.js';
// import { TemplateName } from '../mail/libs/enums/template-name.enum.js';
// import { OrderConfirmationViewParameter } from '../mail/libs/views/order-confirmation/libs/types/order-confirmation-view-parameter.type.js';

class OrdersService implements IService {
  private ordersRepository: OrdersRepository;

  private usersService: UsersService;

  public constructor(
    ordersRepository: OrdersRepository,
    usersService: UsersService,
  ) {
    this.ordersRepository = ordersRepository;
    this.usersService = usersService;
  }

  public async create(payload: CreateOrderDTO): Promise<Order> {
    const { user, orderDelivery, orderItems } = payload;

    const totalPrice = await getOrderTotalPrice(orderItems);

    const createdUser = await this.usersService.create({
      ...user,
      hash: null,
      salt: null,
      status: UserStatus.ANONYMOUS,
      role: UserRole.USER,
      addresses: [orderDelivery],
    });

    try {
      // await mailService.sendPage(
      //   { to: user.email, subject: 'order' },
      //   TemplateName.ORDER_CONFIRMATION,
      //   {} as OrderConfirmationViewParameter,
      // );

      return await this.ordersRepository.createOrder({
        userId: createdUser.id,
        totalPrice,
        orderItems,
      });
    } catch (error) {
      if (createdUser.status === UserStatus.ANONYMOUS) {
        await this.usersService.delete(createdUser.id);
      }

      throw error;
    }
  }

  private async findByIdOrThrow(
    id: string,
  ): Promise<Order & { orderItems: OrderItem[] }> {
    const order = await this.findById(id);

    if (!order) {
      throw new HttpError({
        status: HttpCode.NOT_FOUND,
        message: OrderErrorMessage.NOT_FOUND,
      });
    }

    return order;
  }

  public findById(
    id: string,
  ): Promise<(Order & { orderItems: OrderItem[] }) | null> {
    return this.ordersRepository.getOrderById(id);
  }

  public async update(id: string, payload: UpdateOrderDTO): Promise<Order> {
    const { orderItems, orderDelivery, user } = payload;

    const order = await this.findByIdOrThrow(id);

    const { id: orderId, userId } = order;

    if (user || orderDelivery) {
      await this.usersService.update(userId, {
        ...user,
        addresses: [
          orderDelivery as Omit<
            Address,
            'id' | 'userId' | 'createdAt' | 'updatedAt'
          >,
        ],
      });
    }

    const totalPrice =
      orderItems && orderItems.length > 0
        ? await getOrderTotalPrice(orderItems)
        : order.totalPrice;

    const existingOrderItems =
      await this.ordersRepository.getOrderItemsByOrderId(orderId);

    return this.ordersRepository.updateOrder({
      userId,
      orderId,
      totalPrice,
      orderItems: orderItems ?? getMappedOrderItems(existingOrderItems),
      existingOrderItems: order.orderItems,
    });
  }

  public async delete(id: string): Promise<boolean> {
    const order = await this.findById(id);
    const status = await this.ordersRepository.deleteOrder(id);

    if (order && status) {
      await this.usersService.delete(order.userId);
    }

    return status;
  }
}

export { OrdersService };
