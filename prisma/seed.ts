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

  const localsData = [{ name: 'Auditório Principal' }, { name: 'Auditório Secundário' }, { name: 'Sala de Workshop' }];

  const locals = await prisma.local.createMany({
    data: localsData,
    skipDuplicates: true,
  });

  let localsRecords;

  if (locals.count === 3) {
    localsRecords = await prisma.local.findMany({});
  }

  if (localsRecords[0].id && localsRecords[1].id && localsRecords[2].id) {
    const activitiesData = [
      {
        title: 'Minecraft: montando o PC ideal',
        localId: localsRecords[0].id,
        startsAt: dayjs('2022-10-22 09:00').toDate(),
        endsAt: dayjs('2022-10-22 10:00').toDate(),
        totalVacancies: 27,
        currentVacancies: 27,
      },
      {
        title: 'LoL: montando o PC ideal',
        localId: localsRecords[0].id,
        startsAt: dayjs('2022-10-22 10:00').toDate(),
        endsAt: dayjs('2022-10-22 11:00').toDate(),
        totalVacancies: 27,
        currentVacancies: 0,
      },
      {
        title: 'Palestra x',
        localId: localsRecords[1].id,
        startsAt: dayjs('2022-10-22 09:00').toDate(),
        endsAt: dayjs('2022-10-22 11:00').toDate(),
        totalVacancies: 27,
        currentVacancies: 27,
      },
      {
        title: 'Palestra y',
        localId: localsRecords[2].id,
        startsAt: dayjs('2022-10-22 09:00').toDate(),
        endsAt: dayjs('2022-10-22 10:00').toDate(),
        totalVacancies: 27,
        currentVacancies: 27,
      },
      {
        title: 'Palestra z',
        localId: localsRecords[2].id,
        startsAt: dayjs('2022-10-22 10:00').toDate(),
        endsAt: dayjs('2022-10-22 11:00').toDate(),
        totalVacancies: 27,
        currentVacancies: 0,
      },
      {
        title: 'Palestra y',
        localId: localsRecords[0].id,
        startsAt: dayjs('2022-10-23 10:00').toDate(),
        endsAt: dayjs('2022-10-23 12:00').toDate(),
        totalVacancies: 27,
        currentVacancies: 23,
      },
      {
        title: 'Palestra z',
        localId: localsRecords[1].id,
        startsAt: dayjs('2022-10-23 09:00').toDate(),
        endsAt: dayjs('2022-10-23 11:00').toDate(),
        totalVacancies: 27,
        currentVacancies: 20,
      },
      {
        title: 'Palestra y',
        localId: localsRecords[0].id,
        startsAt: dayjs('2022-10-24 10:00').toDate(),
        endsAt: dayjs('2022-10-24 12:00').toDate(),
        totalVacancies: 27,
        currentVacancies: 23,
      },
      {
        title: 'Palestra z',
        localId: localsRecords[1].id,
        startsAt: dayjs('2022-10-24 09:00').toDate(),
        endsAt: dayjs('2022-10-24 11:00').toDate(),
        totalVacancies: 27,
        currentVacancies: 20,
      },
    ];

    await prisma.activity.createMany({
      data: activitiesData,
      skipDuplicates: true,
    });
  }

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
