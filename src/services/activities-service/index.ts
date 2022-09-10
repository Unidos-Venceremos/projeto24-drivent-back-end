import { Activity, ActivityUser } from '@prisma/client';
import dayjs from 'dayjs';
import pluginIsBetween from 'dayjs/plugin/isBetween';

import ActivityRepository from '@/repositories/activity-repository';
import ActivityUserRepository from '@/repositories/userActivity-repository';
import TicketRepository from '@/repositories/tickets-repository';
import LocalRepository from '@/repositories/local-repository';

import { notFoundUserTicketError } from '@/errors/not-found-user-ticket';
import { unauthorizedActivitiesError, unauthorizedActivityUserError } from '@/errors/unauthorized-activities';
import { notFoundActivityError } from '@/errors/not-found-activity';

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

dayjs.extend(pluginIsBetween);

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
  const activitiesUser = await ActivityUserRepository.findAllByUserId(userId);

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

  const locals = await LocalRepository.getLocals();

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

async function createActivityUser(userId: number, activityId: number) {
  const userTicket = await TicketRepository.getTicketByUserId(userId);

  if (!userTicket) {
    throw notFoundUserTicketError();
  }

  if (!userTicket.presential) {
    throw unauthorizedActivitiesError();
  }

  const interestActivity = await ActivityRepository.findById(activityId);

  if (!interestActivity || interestActivity.currentVacancies <= 0) {
    throw notFoundActivityError();
  }

  const userIsInThisActivity = await ActivityUserRepository.findUserAndActivity(userId, activityId);

  if (userIsInThisActivity.length > 0) throw unauthorizedActivityUserError();

  const userActivities = await ActivityUserRepository.findAllByUserId(userId);

  for (let index = 0; index < userActivities.length; index++) {
    const activity = userActivities[index].Activity;

    const activityStartsAt = dayjs(activity.startsAt);
    const activityEndsAt = dayjs(activity.endsAt);

    const interestActivityStartsAt = dayjs(interestActivity.startsAt);
    const interestActivityEndsAt = dayjs(interestActivity.endsAt);

    const isEquals = activityStartsAt.isSame(interestActivityStartsAt) && activityEndsAt.isSame(interestActivityEndsAt);

    if (
      activityStartsAt.isBetween(interestActivityStartsAt, interestActivityEndsAt) ||
      activityEndsAt.isBetween(interestActivityStartsAt, interestActivityEndsAt) ||
      isEquals
    ) {
      throw unauthorizedActivityUserError('This activity is not compatible with your schedule');
    }
  }

  const activityUser = await ActivityUserRepository.create({ userId, activityId });

  const newCurrentVacancies = interestActivity.currentVacancies - 1;

  if (newCurrentVacancies >= 0) {
    await ActivityRepository.updateVacancies(interestActivity.id, newCurrentVacancies);
  }

  return activityUser;
}

export default { listDaysOfActivities, listActivitiesByDate, createActivityUser };
