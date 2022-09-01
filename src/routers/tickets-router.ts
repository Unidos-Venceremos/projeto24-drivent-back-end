import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getAllAvailableTickets, getTicketByuserId, updateTicket } from '@/controllers/tickets-controller';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .get('/', getAllAvailableTickets)
  .get('/userId', getTicketByuserId)
  .put('/:presential', updateTicket);

export { ticketsRouter };
