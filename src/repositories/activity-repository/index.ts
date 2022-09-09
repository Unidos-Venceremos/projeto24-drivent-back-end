import { prisma } from '@/config';
import { Activity, Local } from '@prisma/client';
import { CreateActivityData } from '@/services/activities-service';

export type ActivityWithLocal = Activity & { Local: Local };

async function create(data: CreateActivityData) {
  const activity = await prisma.activity.create({ data });
  return activity;
}

async function findAll(): Promise<Activity[]> {
  const activities = await prisma.activity.findMany();
  return activities;
}

async function findAllByDate(initialDate: Date, finalDate: Date): Promise<ActivityWithLocal[]> {
  const activities = await prisma.activity.findMany({
    where: { startsAt: { gte: initialDate, lte: finalDate } },
    include: { Local: true },
  });
  return activities;
}

const activityRepository = {
  create,
  findAll,
  findAllByDate,
};

export default activityRepository;
