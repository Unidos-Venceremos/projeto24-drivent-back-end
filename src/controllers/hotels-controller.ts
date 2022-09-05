import { AuthenticatedRequest } from '@/middlewares';
import hotelService from '@/services/hotel-service';
import { Response } from 'express';
import httpStatus from 'http-status';

export async function getAllAvailableHotels(req: AuthenticatedRequest, res: Response) {
  const availableHotels = await hotelService.getAvailableHotels();

  return res.status(httpStatus.OK).send(availableHotels);
}
