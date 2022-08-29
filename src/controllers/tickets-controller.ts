import { AuthenticatedRequest } from '@/middlewares';
import ticketsService from '@/services/tickets-service';
import { Response } from 'express';
import httpStatus from 'http-status';

export async function getAllAvailableTickets(req: AuthenticatedRequest, res: Response) {
  const availableTickets = await ticketsService.getAvailableTickets();

  return res.status(httpStatus.OK).send(availableTickets);
}

export async function getTicketByuserId(req: AuthenticatedRequest, res: Response) {
  const { userId } = req.params;
  const ticket = await ticketsService.getTicketByUserId(Number(userId));
  return res.status(httpStatus.OK).send(ticket);
}

export async function updateTicket(req: AuthenticatedRequest, res: Response) {
  const { userId, bool } = req.body;
  const ticket = await ticketsService.updateTicket(Number(userId), bool);
  return res.status(httpStatus.OK).send(ticket);
}
