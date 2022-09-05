import { getHotels } from '@/repositories/hotel-repository';
import { InexistentHotelsError } from '@/errors/not-found-hotel';

async function getAvailableHotels() {
  const hotels = await getHotels();

  if (!hotels) {
    throw InexistentHotelsError();
  }

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

const hotelsService = {
  getAvailableHotels,
};

export default hotelsService;
