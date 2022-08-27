import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getAllAvailableTickets } from '@/controllers/tickets-controller';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .get('/', getAllAvailableTickets);

export { ticketsRouter };
