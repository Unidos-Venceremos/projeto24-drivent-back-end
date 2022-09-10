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
  const { bedroomId, hotelId } = req.params;
  const intHotelId = +hotelId;
  const intBedroomId = +bedroomId;
  const userId = req.userId;
  console.log({ userId });

  await bedroomService.registerBedroom(intHotelId, intBedroomId, userId);

  return res.status(httpStatus.OK).send({ bedroomId: intBedroomId });
}

export async function getBedroomById(req: AuthenticatedRequest, res: Response) {
  const { bedroomId, hotelId } = req.params;
  const intHotelId = parseInt(hotelId);
  const intBedroomId = parseInt(bedroomId);
  const bedroom = await bedroomService.getBedroomsById(intBedroomId, intHotelId);

  //eslint-disabled-next-line
  console.log(bedroom);
  return res.status(httpStatus.OK).send({ bedroom });
}
