import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getAllAvailableTickets, getTicketByuserId } from '@/controllers/tickets-controller';

const ticketsRouter = Router();

ticketsRouter.all('/*', authenticateToken).get('/', getAllAvailableTickets).get('/userId', getTicketByuserId);

export { ticketsRouter };
