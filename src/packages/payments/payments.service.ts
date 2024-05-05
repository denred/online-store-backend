import { PaymentStatus } from '@prisma/client';
import { type Payment, type PaymentResponse } from './libs/libs.js';
import { type PaymentsRepository } from './payments.repository.js';

class PaymentsService {
  private paymentsRepository: PaymentsRepository;
  public constructor(paymentsRepository: PaymentsRepository) {
    this.paymentsRepository = paymentsRepository;
  }

  public async savePayment(payload: Payment): Promise<PaymentResponse> {
    const { cardNumber, cardHolder, orderId } = payload;

    const response = await this.paymentsRepository.create({
      cardNumber,
      cardHolder,
      status: PaymentStatus.SUCCESS,
      userId: null,
      orderId: orderId ?? null,
    });

    const { id, status } = response;

    return {
      id,
      status,
    };
  }
}

export { PaymentsService };
