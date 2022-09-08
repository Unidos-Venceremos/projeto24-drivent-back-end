import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import ActivitiesController from '@/controllers/activities-controller';

const activitiesRouter = Router();

activitiesRouter.all('/*', authenticateToken).get('/', ActivitiesController.getAllDaysOfActivities);

export { activitiesRouter };
