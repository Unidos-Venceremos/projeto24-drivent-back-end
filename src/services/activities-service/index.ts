import { Activity } from '@prisma/client';
import dayjs from 'dayjs';

import ActivityRepository from '@/repositories/activity-repository';
import TicketRepository from '@/repositories/tickets-repository';

import { notFoundUserTicketError } from '@/errors/not-found-user-ticket';
import { unauthorizedActivitiesError } from '@/errors/unauthorized-activities';

export type CreateActivityData = Omit<Activity, 'id'>;

interface DaysData {
  [key: string]: string;
}

interface ActivitiesData {
  [key: string]: Array<any>;
}

async function listDaysOfActivities(userId: number) {
  const userTicket = await TicketRepository.getTicketByUserId(userId);

  if (!userTicket) {
    throw notFoundUserTicketError();
  }

  if (!userTicket.presential) {
    throw unauthorizedActivitiesError();
  }

  const activities = await ActivityRepository.findAll();

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

async function listActivitiesByDate(userId: number, activityDay: string) {
  const userTicket = await TicketRepository.getTicketByUserId(userId);

  if (!userTicket) {
    throw notFoundUserTicketError();
  }

  if (!userTicket.presential) {
    throw unauthorizedActivitiesError();
  }

  const eventsInit = dayjs(activityDay + ' 09:00').toDate();
  const eventsEnd = dayjs(activityDay + ' 23:59').toDate();

  const activities = await ActivityRepository.findAllByDate(eventsInit, eventsEnd);

  const activitiesInLocals: ActivitiesData = {};

  for (let index = 0; index < activities.length; index++) {
    const activity = activities[index];
    const local = activity.Local.name;

    const duration = dayjs(activity.endsAt).diff(dayjs(activity.startsAt), 'hour');
    const startsAtTimezone = dayjs(activity.startsAt).toDate().toString();
    const endsAtTimezone = dayjs(activity.endsAt).toDate().toString();

    if (!activitiesInLocals[local]) {
      activitiesInLocals[local] = [{ ...activity, startsAt: startsAtTimezone, endsAt: endsAtTimezone, duration }];
    } else {
      activitiesInLocals[local].push({ ...activity, startsAt: startsAtTimezone, endsAt: endsAtTimezone, duration });
    }
  }

  return activitiesInLocals;
}

export default { listDaysOfActivities, listActivitiesByDate };
