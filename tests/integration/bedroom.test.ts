import app, { init } from '@/app';
import faker from '@faker-js/faker';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';

import { createUser } from '../factories';
import { createBedroomsInfo } from '../factories/bedrooms-factory';
import { cleanDb, generateValidToken } from '../helpers';

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe('GET /bedrooms when token is invalid', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/bedrooms');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/bedrooms').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/bedrooms').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
});

describe('GET /bedrooms when token is valid', () => {
  it('should respond with status 200 and return an array of rooms', async () => {
    const token = await generateValidToken();
    const [hotelId, bedroomsInfo] = await createBedroomsInfo();

    const response = await server.get('/bedrooms/hotels/' + hotelId).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toStrictEqual(bedroomsInfo);
  });
});
