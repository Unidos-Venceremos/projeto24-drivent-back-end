import ticketsRepository, { GetAvailabeTicketsParams } from '@/repositories/tickets-repository';

async function getAvailableTickets(): Promise<GetAvailabeTicketsParams[]> {
  return await ticketsRepository.getAvailabeTickets();
}

const ticketsService = {
  getAvailableTickets,
};

export default ticketsService;
