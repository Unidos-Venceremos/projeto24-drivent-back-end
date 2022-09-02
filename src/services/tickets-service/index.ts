import { redis, EXPIRATION } from '@/config';
import ticketsRepository, { GetAvailabeTicketsParams } from '@/repositories/tickets-repository';

async function getAvailableTickets(): Promise<GetAvailabeTicketsParams[]> {
  const cacheKey = 'tickets';
  const cache = await redis.get(cacheKey);
  if (cache) {
    const cacheData: GetAvailabeTicketsParams[] = JSON.parse(cache);
    return cacheData;
  } else {
    const data = await ticketsRepository.getAvailabeTickets();
    redis.setEx(cacheKey, EXPIRATION, JSON.stringify(data));
    return data;
  }
}

const ticketsService = {
  getAvailableTickets,
};

export default ticketsService;
