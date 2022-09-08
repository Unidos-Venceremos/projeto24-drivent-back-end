import { prisma } from '@/config';

export async function createAvailableTicket() {
  //   const data: {
  //     presential: boolean;
  //     userId?: number;
  //   }[] = [
  //     { presential: true, userId: null },
  //     { presential: true, userId: null },
  //     { presential: true, userId: null },
  //     { presential: false, userId: null },
  //     { presential: false, userId: null },
  //     { presential: false, userId: null },
  //   ];

  //   const requisition = await prisma.ticket.createMany({
  //     data,
  //     skipDuplicates: true,
  //   });

  const createPresential = await prisma.ticket.create({
    data: {
      presential: true,
      userId: null,
    },
  });

  const createOnline = await prisma.ticket.create({
    data: {
      presential: false,
      userId: null,
    },
  });

  return [createPresential, createOnline];

  //   return { requisition, data };
}

export async function createAvailableTicketPresentialByUserId(userId: number) {
  const createPresential = await prisma.ticket.create({
    data: {
      presential: true,
      userId,
    },
  });

  return createPresential;
}
