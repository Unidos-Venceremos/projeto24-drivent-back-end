import { createClient, RedisClientType } from 'redis';

export const redis = createClient();

export const EXPIRATION = 30;
