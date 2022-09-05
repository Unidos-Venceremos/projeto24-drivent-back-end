import { redis, EXPIRATION } from '@/config';
import { getBedrooms, getBedroomsWithGuests } from '@/repositories/bedroom-repository';
import { getHotelById } from '@/repositories/hotel-repository';
import { Bedroom, User } from '@prisma/client';
import { notFoundHotelError } from '@/errors/not-found-hotel';
import { invalidIdError } from '@/errors/invalid-info';

export type BedroomWithGuests = Bedroom & { guests: User[] };

export interface BedroomInfo {
  id: number;
  hotelId: number;
  number: number;
  totalCapacity: number[];
  occupped: number[];
  available: boolean;
}

async function getAvailableBedrooms(): Promise<Bedroom[]> {
  const cacheKey = 'bedrooms';
  const cache = await redis.get(cacheKey);
  if (cache) {
    return JSON.parse(cache);
  } else {
    const data = await getBedrooms();
    redis.set(cacheKey, JSON.stringify(data));
    // redis.setEx(cacheKey, EXPIRATION, JSON.stringify(data));
    return data;
  }
}

async function getBedroomByHotelId(id: number): Promise<BedroomInfo[]> {
  if (!id) {
    throw invalidIdError(id);
  }

  const hotelExists = await getHotelById(id);

  if (!hotelExists) {
    throw notFoundHotelError();
  }

  const capacity = {
    SINGLE: 1,
    DOUBLE: 2,
    TRIPLE: 3,
  };

  const bedrooms = await getBedroomsWithGuests();

  const bedroomsFormatted = bedrooms.map((bedroom) => {
    const totalCapacity = new Array(capacity[bedroom.typeRoom]).fill(0);
    const occupped = new Array(bedroom.guests.length).fill(1);
    const available = totalCapacity.length - occupped.length > 0;

    return {
      id: bedroom.id,
      hotelId: bedroom.hotelId,
      number: bedroom.number,
      totalCapacity,
      occupped,
      available,
    };
  });

  return bedroomsFormatted;
}

export const bedroomsService = {
  getAvailableBedrooms,
  getBedroomByHotelId,
};

export default bedroomsService;
