import { redis, EXPIRATION } from '@/config';
import { getBedrooms } from '@/repositories/bedroom-repository';
import { Bedroom } from '@prisma/client';

async function getAvailableBedrooms(): Promise<Bedroom[]> {
  const cacheKey = 'bedrooms';
  const cache = await redis.get(cacheKey);
  if (cache) {
    return JSON.parse(cache);
  } else {
    const data = await getBedrooms();
    redis.setEx(cacheKey, EXPIRATION, JSON.stringify(data));
    return data;
  }
}

export const bedroomsService = {
  getAvailableBedrooms,
};

export default bedroomsService;
