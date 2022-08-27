import { AuthenticatedRequest } from '@/middlewares';
import ticketsService from '@/services/tickets-service';
import { Response } from 'express';
import httpStatus from 'http-status';

export async function getAllAvailableTickets(req: AuthenticatedRequest, res: Response) {
  const availableTickets = await ticketsService.getAvailableTickets();

  return res.status(httpStatus.OK).send(availableTickets);
}
