import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getAllAvailableHotels } from '@/controllers/hotels-controller';

const hotelsRouter = Router();

hotelsRouter.all('/*', authenticateToken).get('/', getAllAvailableHotels);

export { hotelsRouter };
