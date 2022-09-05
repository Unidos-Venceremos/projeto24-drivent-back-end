import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
const prisma = new PrismaClient();

async function main() {
  let event = await prisma.event.findFirst();
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: 'Driven.t',
        logoImageUrl: 'https://files.driveneducation.com.br/images/logo-rounded.png',
        backgroundImageUrl: 'linear-gradient(to right, #FA4098, #FFD77F)',
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, 'days').toDate(),
      },
    });
  }

  const ticketsPresential = await prisma.ticket.findMany({ where: { presential: true, userId: null } });
  const ticketsOnline = await prisma.ticket.findMany({ where: { presential: false, userId: null } });
  if (ticketsPresential.length <= 0 || ticketsOnline.length <= 0) {
    await prisma.ticket.createMany({
      data: [
        { presential: true, userId: null },
        { presential: true, userId: null },
        { presential: true, userId: null },
        { presential: false, userId: null },
        { presential: false, userId: null },
        { presential: false, userId: null },
      ],
      skipDuplicates: true,
    });
  }

  const pallaceHotel = {
    name: 'Pallace Hotel',
    backgroundImageUrl:
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1332&q=80',
  };
  const hotelCreated = await prisma.hotel.upsert({
    where: { name: pallaceHotel.name },
    update: pallaceHotel,
    create: pallaceHotel,
  });

  await prisma.bedroom.createMany({
    data: [
      { hotelId: hotelCreated.id, number: 1, typeRoom: 'SINGLE' },
      { hotelId: hotelCreated.id, number: 2, typeRoom: 'SINGLE' },
      { hotelId: hotelCreated.id, number: 3, typeRoom: 'SINGLE' },
      { hotelId: hotelCreated.id, number: 4, typeRoom: 'DOUBLE' },
      { hotelId: hotelCreated.id, number: 5, typeRoom: 'DOUBLE' },
      { hotelId: hotelCreated.id, number: 6, typeRoom: 'DOUBLE' },
      { hotelId: hotelCreated.id, number: 7, typeRoom: 'TRIPLE' },
      { hotelId: hotelCreated.id, number: 8, typeRoom: 'TRIPLE' },
      { hotelId: hotelCreated.id, number: 9, typeRoom: 'TRIPLE' },
    ],
    skipDuplicates: true,
  });

  console.log({ event });
  console.log({ ticketsPresential });
  console.log({ ticketsOnline });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
