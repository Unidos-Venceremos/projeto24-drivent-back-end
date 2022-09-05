import { getHotelById, getHotels } from '@/repositories/hotel-repository';
import { createAvailableHotel } from './hotels-factory';
import { getBedroomsWithGuests } from '@/repositories/bedroom-repository';
import { notFoundHotelError } from '@/errors/not-found-hotel';

export async function createBedroomsInfo() {
  await createAvailableHotel();

  const hotels = await getHotels();
  const hotelId = hotels[0]?.id;

  const hotelExists = await getHotelById(hotelId);

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

  return [hotelId, bedroomsFormatted];
}
