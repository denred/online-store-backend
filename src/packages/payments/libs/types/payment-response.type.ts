import { type PaymentStatus } from '@prisma/client';

type PaymentResponse = {
  id: string;
  status: PaymentStatus;
};

export { type PaymentResponse };
