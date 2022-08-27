import { prisma } from '@/config';
import { Ticket } from '@prisma/client';

async function getAvailabeTickets(): Promise<GetAvailabeTicketsParams[]> {
  return prisma.ticket.findMany({ where: { userId: null } });
}

export type GetAvailabeTicketsParams = Omit<Ticket, 'id'>;

const ticketsRepository = {
  getAvailabeTickets,
};

export default ticketsRepository;
