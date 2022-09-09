import app, { init } from '@/app';
import faker from '@faker-js/faker';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';

import { createUser } from '../factories';
import { createActivitiesInfo, createActivitiesByDate } from '../factories/activities-factory';
import { createAvailableTicketPresentialByUserId } from '../factories/tickets-factory';
import { cleanDb, generateValidTokenAndUser } from '../helpers';

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe('GET /activities when token is invalid', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/activities');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/activities').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/activities').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
});

describe('GET /activities when token is valid', () => {
  it('should respond with status 200 and return an array of activities', async () => {
    const [userId, token] = await generateValidTokenAndUser();
    await createAvailableTicketPresentialByUserId(+userId);
    const activitiesInfo = await createActivitiesInfo(+userId);

    const response = await server.get('/activities').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toStrictEqual(activitiesInfo);
  });
});

describe('GET /activities/filter filter by  when token is valid', () => {
  it('should respond with status 200 and return an array of activities per local by date', async () => {
    const [userId, token] = await generateValidTokenAndUser();
    await createAvailableTicketPresentialByUserId(+userId);
    const date = '2022-10-22';
    await createActivitiesByDate(+userId, date);

    const response = await server
      .get('/activities/filter/?activityDay=' + date)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).not.toBe(null);
  });
});
