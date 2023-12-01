import { type Order, UserStatus } from '@prisma/client';

import { HttpError } from '~/libs/exceptions/http-error.exception.js';
import { type IService } from '~/libs/interfaces/interfaces.js';
import { HttpCode } from '~/libs/packages/http/http.js';

import { type ProductsService } from '../products/products.js';
import { type UsersService } from '../users/users.js';
import { OrderErrorMessage } from './libs/enums/order-error-message.enum.js';
import {
  getMappedOrderItems,
  getOrderTotalPrice,
} from './libs/helpers/helpers.js';
import {
  type CreateOrderDTO,
  type UpdateOrderPayload,
} from './libs/types/types.js';
import { type OrdersRepository } from './orders.repository.js';

class OrdersService implements IService {
  private ordersRepository: OrdersRepository;

  private usersService: UsersService;

  private productsService: ProductsService;

  public constructor(
    ordersRepository: OrdersRepository,
    usersService: UsersService,
    productsService: ProductsService,
  ) {
    this.ordersRepository = ordersRepository;
    this.usersService = usersService;
    this.productsService = productsService;
  }

  public async create(payload: CreateOrderDTO): Promise<Order> {
    const { user, orderDelivery, orderItems } = payload;

    const mappedOrderItems = await getMappedOrderItems(
      orderItems,
      this.productsService,
    );
    const totalPrice = getOrderTotalPrice(mappedOrderItems);

    const createdUser = await this.usersService.create({
      ...user,
      addresses: [orderDelivery],
    });

    try {
      return await this.ordersRepository.createOrder({
        userId: createdUser.id,
        totalPrice,
        orderItems,
      });
    } catch (error) {
      if (createdUser.status === UserStatus.NOT_REGISTERED) {
        await this.usersService.delete(createdUser.id);
      }

      throw error;
    }
  }

  public async findById(id: string): Promise<Order | null> {
    return await this.ordersRepository.getOrderById(id);
  }

  public async update(
    id: string,
    payload: Partial<UpdateOrderPayload>,
  ): Promise<Order> {
    const order = await this.findById(id);

    if (!order) {
      throw new HttpError({
        status: HttpCode.NOT_FOUND,
        message: OrderErrorMessage.NOT_FOUND,
      });
    }

    const { orderItems } = payload;

    const { id: orderId, userId } = order;

    let totalPrice = order.totalPrice;

    const existingOrderItems =
      await this.ordersRepository.getOrderItemsByOrderId(orderId);

    let mappedExistingOrderItems = existingOrderItems.map((item) => {
      const { productId, quantity } = item;

      return { productId, quantity };
    });

    if (orderItems) {
      const mappedOrderItems = await getMappedOrderItems(
        orderItems,
        this.productsService,
      );
      totalPrice = getOrderTotalPrice(mappedOrderItems);
      mappedExistingOrderItems = orderItems;
    }

    return await this.ordersRepository.updateOrder({
      userId,
      orderId,
      totalPrice,
      orderItems: mappedExistingOrderItems,
    });
  }

  public async delete(id: string): Promise<boolean> {
    return await this.ordersRepository.deleteOrder(id);
  }
}

export { OrdersService };
