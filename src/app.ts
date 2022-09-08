import 'reflect-metadata';
import 'express-async-errors';
import express, { Express } from 'express';
import cors from 'cors';
import axios from 'axios';

import { loadEnv, connectDb, disconnectDB, redis } from '@/config';

loadEnv();

import { handleApplicationErrors } from '@/middlewares';
import {
  usersRouter,
  authenticationRouter,
  eventsRouter,
  enrollmentsRouter,
  ticketsRouter,
  bedroomsRouter,
  oauthRouter,
  paymentsRouter,
  hotelsRouter,
  activitiesRouter,
} from '@/routers';

const app = express();
app
  .use(cors())
  .use(express.json())
  .get('/health', (_req, res) => res.send('OK!'))
  .use('/users', usersRouter)
  .use('/auth', authenticationRouter)
  .use('/oauth', oauthRouter)
  .use('/event', eventsRouter)
  .use('/enrollments', enrollmentsRouter)
  .use('/tickets', ticketsRouter)
  .use('/bedrooms', bedroomsRouter)
  .use('/payments', paymentsRouter)
  .use('/hotels', hotelsRouter)
  .use('/activities', activitiesRouter)
  .use(handleApplicationErrors);

export function init(): Promise<Express> {
  connectDb();
  redis.connect();
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  await disconnectDB();
}

export default app;
