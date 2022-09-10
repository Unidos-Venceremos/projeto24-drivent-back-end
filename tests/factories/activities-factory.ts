import dayjs from 'dayjs';
import { Local, ActivityUser } from '@prisma/client';

import { prisma } from '@/config';

import { Activity } from '@prisma/client';

import activityRepository from '@/repositories/activity-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import activityUserRepository from '@/repositories/userActivity-repository';
import localRepository from '@/repositories/local-repository';

import { notFoundUserTicketError } from '@/errors/not-found-user-ticket';
import { unauthorizedActivitiesError } from '@/errors/unauthorized-activities';

export type CreateActivityData = Omit<Activity, 'id'>;

interface DaysData {
  [key: string]: string;
}

interface ActivitiesData {
  [key: string]: any[];
}

interface ActivitiesUserData {
  [key: string]: ActivityUser[];
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

export async function createActivitiesByDate(userId: number, activityDay: string) {
  const userTicket = await ticketsRepository.getTicketByUserId(userId);

  if (!userTicket) {
    throw notFoundUserTicketError();
  }

  if (!userTicket.presential) {
    throw unauthorizedActivitiesError();
  }

  const eventsInit = dayjs(activityDay + ' 09:00').toDate();
  const eventsEnd = dayjs(activityDay + ' 23:59').toDate();

  const activities = await activityRepository.findAllByDate(eventsInit, eventsEnd);
  const activitiesUser = await activityUserRepository.findAllByUserId(userId);

  const activitiesInLocals: ActivitiesData = {};
  const activitiesUserInLocals: ActivitiesUserData = {};

  for (let index = 0; index < activitiesUser.length; index++) {
    const activity = activitiesUser[index];

    if (!activitiesUserInLocals[activity.id]) {
      activitiesUserInLocals[activity.Activity.id] = [activity];
    } else {
      activitiesUserInLocals[activity.Activity.id].push(activity);
    }
  }

  const locals = await localRepository.getLocals();

  for (let index = 0; index < locals.length; index++) {
    const local = locals[index].name;

    activitiesInLocals[local] = [];
  }

  for (let index = 0; index < activities.length; index++) {
    const activity = activities[index];
    const local = activity.Local.name;

    const duration = dayjs(activity.endsAt).diff(dayjs(activity.startsAt), 'hour');
    const startsAtTimezone = dayjs(activity.startsAt).toDate().toString();
    const endsAtTimezone = dayjs(activity.endsAt).toDate().toString();

    const participantActivity = activitiesUserInLocals[activity.id];

    const isParticipant = !!participantActivity;

    if (!activitiesInLocals[local]) {
      activitiesInLocals[local] = [
        { ...activity, startsAt: startsAtTimezone, endsAt: endsAtTimezone, duration, isParticipant },
      ];
    } else {
      activitiesInLocals[local].push({
        ...activity,
        startsAt: startsAtTimezone,
        endsAt: endsAtTimezone,
        duration,
        isParticipant,
      });
    }
  }

  return activitiesInLocals;
}
