import { prisma } from '@/config';
import { Payment } from '@prisma/client';

export type paymentsRepository = Omit<Payment, 'id' | 'updatedAt' | 'createdAt'>;

export async function registerPayment(payment: paymentsRepository) {
  return prisma.payment.create({
    data: {
      ...payment,
    },
  });
}
