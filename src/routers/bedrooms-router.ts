import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getAllAvailableBedrooms } from '@/controllers/bedrooms-controller';

const bedroomsRouter = Router();

bedroomsRouter
  .all('/*', authenticateToken)
  .get('/', getAllAvailableBedrooms);

export { bedroomsRouter };