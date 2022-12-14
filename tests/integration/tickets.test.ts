import app, { init } from '@/app';
import { redis } from '@/config';
import faker from '@faker-js/faker';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import { createUser } from '../factories';
import { createAvailableTicket } from '../factories/tickets-factory';
import { cleanDb, generateValidToken } from '../helpers';

beforeAll(async () => {
  await init();
  await cleanDb();
});

beforeEach(async () => {
  redis.flushAll();
});

const server = supertest(app);

describe('GET /tickets when token is invalid', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/tickets');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/tickets').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/tickets').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
});

describe('GET /tickets when token is valid', () => {
  it('should respond with status 200 and an empty array', async () => {
    const token = await generateValidToken();

    const response = await server.get('/tickets').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toStrictEqual([]);
  });

  it('should respond with status 200 and array of 2 Tickets', async () => {
    const tickets = await createAvailableTicket();
    const token = await generateValidToken();

    const response = await server.get('/tickets').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toStrictEqual(tickets);
  });
});
