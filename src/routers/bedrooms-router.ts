import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import {
  getAllAvailableBedrooms,
  getBedroomByHotelId,
  registerBedroom,
  getBedroomById,
} from '@/controllers/bedrooms-controller';

const bedroomsRouter = Router();

bedroomsRouter
  .all('/*', authenticateToken)
  .get('/', getAllAvailableBedrooms)
  .get('/hotels/:hotelId', getBedroomByHotelId)
  .post('/:hotelId/:bedroomId', registerBedroom)
  .get('/:hotelId/:bedroomId', getBedroomById);

export { bedroomsRouter };
