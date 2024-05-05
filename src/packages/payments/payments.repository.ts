import { type Payment, type PrismaClient } from '@prisma/client';

class PaymentsRepository {
  private db: Pick<PrismaClient, 'payment' | '$transaction' | 'order'>;

  public constructor(
    database: Pick<PrismaClient, 'payment' | '$transaction' | 'order'>,
  ) {
    this.db = database;
  }

  public async create(
    payload: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Payment> {
    const { orderId = null } = payload;

    return this.db.$transaction(async (tx) => {
      const payment = await tx.payment.create({ data: payload });

      if (!payment) {
        throw new Error('Payment not created');
      }

      if (orderId) {
        await tx.order.update({
          where: { id: orderId },
          data: { paymentId: payment.id },
        });
      }

      return payment;
    });
  }
}

export { PaymentsRepository };
