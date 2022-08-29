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
  };
  const hotelCreated = await prisma.hotel.upsert({
    where: { name: pallaceHotel.name },
    update: pallaceHotel,
    create: pallaceHotel,
  })

  await prisma.bedroom.createMany({
    data: [
      { hotelId: hotelCreated.id, typeRoom: 'SINGLE' },
      { hotelId: hotelCreated.id, typeRoom: 'SINGLE' },
      { hotelId: hotelCreated.id, typeRoom: 'SINGLE' },
      { hotelId: hotelCreated.id, typeRoom: 'DOUBLE' },
      { hotelId: hotelCreated.id, typeRoom: 'DOUBLE' },
      { hotelId: hotelCreated.id, typeRoom: 'DOUBLE' },
      { hotelId: hotelCreated.id, typeRoom: 'TRIPLE' },
      { hotelId: hotelCreated.id, typeRoom: 'TRIPLE' },
      { hotelId: hotelCreated.id, typeRoom: 'TRIPLE' },
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
