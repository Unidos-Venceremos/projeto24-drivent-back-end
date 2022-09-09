import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getAllDaysOfActivities, getAllActivitiesByDate } from '@/controllers/activities-controller';

const activitiesRouter = Router();

activitiesRouter.all('/*', authenticateToken).get('/', getAllDaysOfActivities).get('/filter/', getAllActivitiesByDate);

export { activitiesRouter };
