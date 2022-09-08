import dayjs from 'dayjs';
import { Local } from '@prisma/client';

import { prisma } from '@/config';

import activityRepository from '@/repositories/activity-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import { notFoundUserTicketError } from '@/errors/not-found-user-ticket';
import { unauthorizedActivitiesError } from '@/errors/unauthorized-activities';

interface DaysData {
  [key: string]: string;
}

export async function createLocals() {
  const localsData = [{ name: 'Auditório Principal' }, { name: 'Auditório Secundário' }, { name: 'Sala de Workshop' }];

  const locals = await prisma.local.createMany({
    data: localsData,
    skipDuplicates: true,
  });

  let localsRecords;

  if (locals.count === 3) {
    localsRecords = await prisma.local.findMany({});
  }

  return localsRecords;
}

export async function createActivities(locals: Local[]) {
  if (locals[0].id && locals[1].id && locals[2].id) {
    const activitiesData = [
      {
        title: 'Minecraft: montando o PC ideal',
        localId: locals[0].id,
        startsAt: dayjs('2022-10-22 09:00').toDate(),
        endsAt: dayjs('2022-10-22 10:00').toDate(),
        totalVacancies: 27,
        currentVacancies: 27,
      },
      {
        title: 'LoL: montando o PC ideal',
        localId: locals[0].id,
        startsAt: dayjs('2022-10-22 10:00').toDate(),
        endsAt: dayjs('2022-10-22 11:00').toDate(),
        totalVacancies: 27,
        currentVacancies: 0,
      },
      {
        title: 'Palestra x',
        localId: locals[1].id,
        startsAt: dayjs('2022-10-22 09:00').toDate(),
        endsAt: dayjs('2022-10-22 11:00').toDate(),
        totalVacancies: 27,
        currentVacancies: 27,
      },
      {
        title: 'Palestra y',
        localId: locals[2].id,
        startsAt: dayjs('2022-10-22 09:00').toDate(),
        endsAt: dayjs('2022-10-22 10:00').toDate(),
        totalVacancies: 27,
        currentVacancies: 27,
      },
      {
        title: 'Palestra z',
        localId: locals[2].id,
        startsAt: dayjs('2022-10-22 10:00').toDate(),
        endsAt: dayjs('2022-10-22 11:00').toDate(),
        totalVacancies: 27,
        currentVacancies: 0,
      },
      {
        title: 'Palestra y',
        localId: locals[0].id,
        startsAt: dayjs('2022-10-23 10:00').toDate(),
        endsAt: dayjs('2022-10-23 12:00').toDate(),
        totalVacancies: 27,
        currentVacancies: 23,
      },
      {
        title: 'Palestra z',
        localId: locals[1].id,
        startsAt: dayjs('2022-10-23 09:00').toDate(),
        endsAt: dayjs('2022-10-23 11:00').toDate(),
        totalVacancies: 27,
        currentVacancies: 20,
      },
      {
        title: 'Palestra y',
        localId: locals[0].id,
        startsAt: dayjs('2022-10-24 10:00').toDate(),
        endsAt: dayjs('2022-10-24 12:00').toDate(),
        totalVacancies: 27,
        currentVacancies: 23,
      },
      {
        title: 'Palestra z',
        localId: locals[1].id,
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
}

export async function createActivitiesInfo(userId: number) {
  await createLocals();

  const locals = await prisma.local.findMany({});

  if (locals) {
    await createActivities(locals);

    const userTicket = await ticketsRepository.getTicketByUserId(userId);

    if (!userTicket) {
      throw notFoundUserTicketError();
    }

    if (!userTicket.presential) {
      throw unauthorizedActivitiesError();
    }

    const activities = await activityRepository.findAll();

    const days: DaysData = {};

    for (let index = 0; index < activities.length; index++) {
      const activity = activities[index];

      if (activity.startsAt) {
        const day = dayjs(activity.startsAt).toDate().toISOString().split('T')[0];

        if (!days[day]) {
          days[day] = day;
        }
      }
    }

    return Object.keys(days);
  }
}
