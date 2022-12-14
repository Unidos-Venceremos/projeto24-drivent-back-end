import * as jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

import { createUser } from './factories';
import { createSession } from './factories/sessions-factory';
import { prisma, redis } from '@/config';

export async function cleanDb() {
  await prisma.activityUser.deleteMany({});
  await prisma.activity.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.ticket.deleteMany({});
  await prisma.bedroom.deleteMany({});
  await prisma.hotel.deleteMany({});
  redis.flushAll();
}

export async function generateValidToken(user?: User) {
  const incomingUser = user || (await createUser());
  const token = jwt.sign({ userId: incomingUser.id }, process.env.JWT_SECRET);

  await createSession(token);

  return token;
}

export async function generateValidTokenAndUser(user?: User) {
  const incomingUser = user || (await createUser());
  const token = jwt.sign({ userId: incomingUser.id }, process.env.JWT_SECRET);

  await createSession(token);

  return [incomingUser?.id, token];
}
