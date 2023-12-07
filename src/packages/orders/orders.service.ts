import { type Address, type Order, UserRole, UserStatus } from '@prisma/client';

import { HttpError } from '~/libs/exceptions/http-error.exception.js';
import { type IService } from '~/libs/interfaces/interfaces.js';
import { HttpCode } from '~/libs/packages/http/http.js';

import { type UsersService } from '../users/users.js';
import { OrderErrorMessage } from './libs/enums/order-error-message.enum.js';
import {
  getMappedOrderItems,
  getOrderTotalPrice,
} from './libs/helpers/helpers.js';
import {
  type CreateOrderDTO,
  type UpdateOrderDTO,
} from './libs/types/types.js';
import { type OrdersRepository } from './orders.repository.js';

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

  private async findByIdOrThrow(id: string): Promise<Order> {
    const order = await this.findById(id);

    if (!order) {
      throw new HttpError({
        status: HttpCode.NOT_FOUND,
        message: OrderErrorMessage.NOT_FOUND,
      });
    }

    return order;
  }

  public findById(id: string): Promise<Order | null> {
    return this.ordersRepository.getOrderById(id);
  }

  public async update(id: string, payload: UpdateOrderDTO): Promise<Order> {
    const { orderItems, orderDelivery, user } = payload;

    const order = await this.findByIdOrThrow(id);

    const { id: orderId, userId } = order;

    (user || orderDelivery) &&
      (await this.usersService.update(userId, {
        ...user,
        addresses: [
          orderDelivery as Omit<
            Address,
            'id' | 'userId' | 'createdAt' | 'updatedAt'
          >,
        ],
      }));

    const totalPrice =
      orderItems && orderItems.length > 0
        ? await getOrderTotalPrice(orderItems)
        : order.totalPrice;

    const existingOrderItems =
      await this.ordersRepository.getOrderItemsByOrderId(orderId);

    return await this.ordersRepository.updateOrder({
      userId,
      orderId,
      totalPrice,
      orderItems: orderItems ?? getMappedOrderItems(existingOrderItems),
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
