import ticketsRepository, { GetAvailabeTicketsParams } from '@/repositories/tickets-repository';

async function getAvailableTickets(): Promise<GetAvailabeTicketsParams[]> {
  return await ticketsRepository.getAvailabeTickets();
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
