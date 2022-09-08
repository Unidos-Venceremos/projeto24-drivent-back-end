import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getAllAvailableBedrooms, getBedroomByHotelId, registerBedroom } from '@/controllers/bedrooms-controller';

const bedroomsRouter = Router();

bedroomsRouter
  .all('/*', authenticateToken)
  .get('/', getAllAvailableBedrooms)
  .get('/hotels/:hotelId', getBedroomByHotelId)
  .post('/:bedroomId', registerBedroom);

export { bedroomsRouter };
