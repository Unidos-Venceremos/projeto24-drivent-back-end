import app, { init } from '@/app';
import { redis } from '@/config';
import httpStatus from 'http-status';
import supertest from 'supertest';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  redis.flushAll();
});

const server = supertest(app);

describe('GET /health', () => {
  it('should respond with status 200 with OK! text', async () => {
    const response = await server.get('/health');

    expect(response.status).toBe(httpStatus.OK);
    expect(response.text).toBe('OK!');
  });
});
