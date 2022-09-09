import Cryptr from 'cryptr';
import * as paymentsRepository from '@/repositories/payments-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import { cannotOnlineWithHotelError, invalidDataErrorGeneric } from '@/errors';
import { prisma } from '@/config';

interface payment {
  userId: number;
  presential: boolean;
  holder: string;
  expiry: string;
  cvv: string;
  number: string;
  withHotel: boolean;
}

export async function registerPayment(payment: payment) {
  const { userId, presential, holder, expiry, cvv, number, withHotel } = payment;

  if (!presential && withHotel) throw cannotOnlineWithHotelError();

  try {
    await prisma.$transaction(async (prisma) => {
      const ticket = await ticketsRepository.getFirstTicket(presential);
      const cvvHash = encrypt(cvv);

      await ticketsRepository.updateTicket(ticket.id, userId);

      const data = { userId, holder, expiry, cvv: cvvHash, number, withHotel, ticketId: ticket.id };

      return await paymentsRepository.registerPayment(data);
    });
  } catch (error) {
    throw invalidDataErrorGeneric();
  }
}

function encrypt(cvv: string) {
  const cryptr = new Cryptr(process.env.CRYPT_KEY);
  return cryptr.encrypt(cvv);
}
