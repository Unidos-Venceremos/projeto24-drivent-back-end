import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getAllAvailableBedrooms, getBedroomByHotelId } from '@/controllers/bedrooms-controller';

const bedroomsRouter = Router();

bedroomsRouter
  .all('/*', authenticateToken)
  .get('/', getAllAvailableBedrooms)
  .get('/hotels/:hotelId', getBedroomByHotelId);

export { bedroomsRouter };
