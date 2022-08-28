import { AuthenticatedRequest } from '@/middlewares';
import bedroomService from '@/services/bedrooms-service';
import { Response } from 'express';
import httpStatus from 'http-status';

export async function getAllAvailableBedrooms(req: AuthenticatedRequest, res: Response) {
  const availableBedrooms = await bedroomService.getAvailableBedrooms();

  return res.status(httpStatus.OK).send(availableBedrooms);
}
