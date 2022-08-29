import { prisma } from '@/config';
import { Ticket } from '@prisma/client';

async function getAvailabeTickets(): Promise<GetAvailabeTicketsParams[]> {
  return prisma.ticket.findMany({ where: { userId: null } });
}

async function getTicketByUserId(userId: number): Promise<Ticket> {
  return prisma.ticket.findFirst({ where: { userId } });
}

async function updateTicket(ticketId: number, userId: number): Promise<Ticket> {
  return prisma.ticket.update({ where: { id: ticketId }, data: { userId } });
}

async function getFirstTicket(bool: boolean): Promise<Ticket> {
  return prisma.ticket.findFirst({ where: { presential: bool, userId: null } });
}

export type GetAvailabeTicketsParams = Omit<Ticket, 'id'>;

const ticketsRepository = {
  getAvailabeTickets,
  getTicketByUserId,
  updateTicket,
  getFirstTicket,
};

export default ticketsRepository;
