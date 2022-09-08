import { Response } from 'express';
import httpStatus from 'http-status';

import { AuthenticatedRequest } from '@/middlewares';
import activitiesService from '@/services/activities-service';

async function getAllDaysOfActivities(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const days = await activitiesService.listDaysOfActivities(+userId);

  return res.status(httpStatus.OK).send(days);
}

export default { getAllDaysOfActivities };
