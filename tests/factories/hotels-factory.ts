import { prisma } from '@/config';
import { getHotels } from '@/repositories/hotel-repository';

export async function createAvailableHotel() {
  const pallaceHotel = {
    name: 'Pallace Hotel',
    backgroundImageUrl:
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80',
  };
  const hotelCreated = await prisma.hotel.upsert({
    where: { name: pallaceHotel.name },
    update: pallaceHotel,
    create: pallaceHotel,
  });

  const roomsCreated = await prisma.bedroom.createMany({
    data: [
      { hotelId: hotelCreated.id, number: 1, typeRoom: 'SINGLE' },
      { hotelId: hotelCreated.id, number: 2, typeRoom: 'SINGLE' },
      { hotelId: hotelCreated.id, number: 3, typeRoom: 'SINGLE' },
      { hotelId: hotelCreated.id, number: 4, typeRoom: 'DOUBLE' },
      { hotelId: hotelCreated.id, number: 5, typeRoom: 'DOUBLE' },
      { hotelId: hotelCreated.id, number: 6, typeRoom: 'DOUBLE' },
      { hotelId: hotelCreated.id, number: 7, typeRoom: 'TRIPLE' },
      { hotelId: hotelCreated.id, number: 8, typeRoom: 'TRIPLE' },
      { hotelId: hotelCreated.id, number: 9, typeRoom: 'TRIPLE' },
    ],
    skipDuplicates: true,
  });

  return [hotelCreated, roomsCreated];
}

export async function createHotelsInfo() {
  await createAvailableHotel();

  const hotels = await getHotels();

  const capacity = {
    SINGLE: 1,
    DOUBLE: 2,
    TRIPLE: 3,
  };

  const hotelsFormatted = hotels.map((hotel) => {
    const accomodationTypes = [];

    if (hotel.singleAccommodation) accomodationTypes.push('Single');
    if (hotel.doubleAccommodation) accomodationTypes.push('Double');
    if (hotel.tripleAccommodation) accomodationTypes.push('Triple');

    let vacancies = 0;

    hotel.bedrooms.forEach((bedroom) => {
      const capacityBedroom = capacity[bedroom.typeRoom];
      const vacanciesBedroom = capacityBedroom - bedroom.guests.length;

      vacancies += vacanciesBedroom;
    });

    return {
      id: hotel.id,
      name: hotel.name,
      backgroundImageUrl: hotel.backgroundImageUrl,
      accomodationTypes,
      vacancies,
    };
  });

  return hotelsFormatted;
}
