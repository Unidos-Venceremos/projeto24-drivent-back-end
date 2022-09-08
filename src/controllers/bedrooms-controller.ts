import { AuthenticatedRequest } from '@/middlewares';
import bedroomService from '@/services/bedrooms-service';
import { Response } from 'express';
import httpStatus from 'http-status';

export async function getAllAvailableBedrooms(req: AuthenticatedRequest, res: Response) {
  const availableBedrooms = await bedroomService.getAvailableBedrooms();

  return res.status(httpStatus.OK).send(availableBedrooms);
}

export async function getBedroomByHotelId(req: AuthenticatedRequest, res: Response) {
  const { hotelId } = req.params;

  const bedrooms = await bedroomService.getBedroomByHotelId(+hotelId);

  return res.status(httpStatus.OK).send(bedrooms);
}

export async function registerBedroom(req: AuthenticatedRequest, res: Response) {
  const { bedroomId } = req.params;
  const intBedroomId = parseInt(bedroomId);
  const userId = req.userId;

  await bedroomService.registerBedroom(intBedroomId, userId);

  return res.status(httpStatus.OK).send({ bedroomId: intBedroomId });
}
