import { AuthenticatedRequest } from '@/middlewares';
import * as paymentsService from '@/services/payments-service';
import { Response } from 'express';
import httpStatus from 'http-status';

export async function registerPayment(req: AuthenticatedRequest, res: Response) {
  const { presential, holder, expiry, cvv, number, withHotel } = req.body;
  const userId = req.userId;
  const data = { userId, presential, holder, expiry, cvv, number, withHotel };
  const payment = await paymentsService.registerPayment(data);
  return res.status(httpStatus.OK).send(payment);
}
