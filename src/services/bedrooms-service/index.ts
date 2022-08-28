import { getBedrooms } from '@/repositories/bedroom-repository';
import { Bedroom } from '@prisma/client';

async function getAvailableBedrooms(): Promise<Bedroom[]> {
  return await getBedrooms();
}

export const bedroomsService = {
  getAvailableBedrooms,
};

export default bedroomsService;
