import { Response } from 'express';
import httpStatus from 'http-status';

import { AuthenticatedRequest } from '@/middlewares';
import activitiesService from '@/services/activities-service';

export async function getAllDaysOfActivities(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const days = await activitiesService.listDaysOfActivities(+userId);

  return res.status(httpStatus.OK).send(days);
}

export async function getAllActivitiesByDate(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { activityDay } = req.query as { activityDay: string };

  const activities = await activitiesService.listActivitiesByDate(+userId, activityDay);

  return res.status(httpStatus.OK).send(activities);
}

export async function addActivityInActivitiesUser(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { activityId } = req.params;

  const activities = await activitiesService.createActivityUser(+userId, +activityId);

  return res.status(httpStatus.OK).send(activities);
}
