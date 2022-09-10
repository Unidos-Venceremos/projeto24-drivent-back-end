import { redis, prisma } from '@/config';
import { getBedroomById, getBedrooms, getBedroomsWithGuests } from '@/repositories/bedroom-repository';
import { getHotelById } from '@/repositories/hotel-repository';
import { Bedroom, User } from '@prisma/client';
import { notFoundHotelError } from '@/errors/not-found-hotel';
import { invalidIdError } from '@/errors/invalid-info';
import { notAvailableBedroomError, notFoundBedroomError, repeatedBedroom } from '@/errors/not-found-bedroom';
import userRepository from '@/repositories/user-repository';
import { invalidDataErrorGeneric } from '@/errors';

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
  //eslint-disable-next-line
  console.log('Cache: ', cache);
  if (cache) {
    return JSON.parse(cache);
  } else {
    const data = await getBedrooms();
    //eslint-disable-next-line
    console.log('Data: ', data);
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

async function registerBedroom(HotelId: number, bedroomId: number, userId: number) {
  const userFind = await userRepository.findUserById(userId);

  if (!bedroomId) {
    throw invalidIdError(bedroomId);
  }

  if (!HotelId) {
    throw invalidIdError(HotelId);
  }

  const bedroomExists = await getBedroomById(bedroomId, HotelId);
  if (!bedroomExists) {
    throw notFoundBedroomError();
  }
  if (!bedroomExists.available) {
    throw notAvailableBedroomError();
  }

  if (userFind.bedroomId === bedroomId && userFind.Bedroom.hotelId === HotelId) {
    // console.log(userFind);
    // console.log(bedroomExists);
    //eslint-disable-next-line
    console.log('Mesmo quarto');
    throw repeatedBedroom();
  }

  try {
    await prisma.$transaction(async (prisma) => {
      if (userFind.bedroomId) {
        await prisma.bedroom.update({
          where: { id: userFind.bedroomId },
          data: { available: true },
          include: { guests: true },
        });
        // await availableBedroom(userFind.bedroomId);
      }

      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          bedroomId,
        },
      });
      // await userRepository.attachBedroomIdToUser(userId, bedroomId);

      // console.log(userFind);
      // console.log(bedroomExists);
      //eslint-disable-next-line
      console.log('Quarto novo');

      const actualizedBedroom = await getBedroomById(bedroomId, HotelId);
      if (
        (actualizedBedroom.guests.length === 1 && actualizedBedroom.typeRoom === 'SINGLE') ||
        (actualizedBedroom.guests.length === 2 && actualizedBedroom.typeRoom === 'DOUBLE') ||
        (actualizedBedroom.guests.length === 3 && actualizedBedroom.typeRoom === 'TRIPLE')
      ) {
        await prisma.bedroom.update({
          where: { id: bedroomId },
          data: { available: false },
          include: { guests: true },
        });
        // await unavailableBedroom(bedroomId);

        // const lockedBedroom = await unavailableBedroom(bedroomId);
        // console.log(lockedBedroom);
      }
      // console.log(actualizedBedroom);
    });
  } catch (error) {
    throw invalidDataErrorGeneric();
  }

  const cacheKey = 'bedrooms';
  redis.del(cacheKey);
}

function getBedroomsById(id: number, hotelId: number): Promise<BedroomWithGuests> {
  const bedroom = getBedroomById(id, hotelId);
  if (!bedroom) {
    throw notFoundBedroomError();
  }
  return bedroom;
}

export const bedroomsService = {
  getAvailableBedrooms,
  getBedroomByHotelId,
  registerBedroom,
  getBedroomsById,
};

export default bedroomsService;
