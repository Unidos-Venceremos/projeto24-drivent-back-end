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

export default { listDaysOfActivities };
