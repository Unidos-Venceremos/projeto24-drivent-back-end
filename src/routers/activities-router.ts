import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import {
  getAllDaysOfActivities,
  getAllActivitiesByDate,
  addActivityInActivitiesUser,
} from '@/controllers/activities-controller';

const activitiesRouter = Router();

activitiesRouter
  .all('/*', authenticateToken)
  .get('/', getAllDaysOfActivities)
  .get('/filter/', getAllActivitiesByDate)
  .post('/create/:activityId', addActivityInActivitiesUser);

export { activitiesRouter };
