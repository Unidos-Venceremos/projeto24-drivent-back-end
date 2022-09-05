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
    redis.set(cacheKey, JSON.stringify(data));
    // redis.setEx(cacheKey, EXPIRATION, JSON.stringify(data));
    return data;
  }
}

async function getTicketByUserId(userId: number): Promise<GetAvailabeTicketsParams> {
  return await ticketsRepository.getTicketByUserId(userId);
}

async function updateTicket(userId: number, bool: boolean): Promise<GetAvailabeTicketsParams> {
  const ticket = await ticketsRepository.getFirstTicket(bool);
  return await ticketsRepository.updateTicket(ticket.id, userId);
}

const ticketsService = {
  getAvailableTickets,
  getTicketByUserId,
  updateTicket,
};

export default ticketsService;
