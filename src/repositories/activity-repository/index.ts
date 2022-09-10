import { prisma } from '@/config';
import { Activity, Local } from '@prisma/client';
import { CreateActivityData } from '@/services/activities-service';

export type ActivityWithLocal = Activity & { Local: Local };

async function create(data: CreateActivityData) {
  const activity = await prisma.activity.create({ data });
  return activity;
}

async function findAll(): Promise<Activity[]> {
  const activities = await prisma.activity.findMany({
    orderBy: { startsAt: 'asc' },
  });
  return activities;
}

async function findById(id: number): Promise<Activity> {
  const activity = await prisma.activity.findUnique({ where: { id }, include: { participants: true } });
  return activity;
}

async function findAllByDate(initialDate: Date, finalDate: Date): Promise<ActivityWithLocal[]> {
  const activities = await prisma.activity.findMany({
    where: { startsAt: { gte: initialDate, lte: finalDate } },
    include: { Local: true },
  });
  return activities;
}

async function updateVacancies(id: number, vacancies: number) {
  const activity = await prisma.activity.update({
    where: { id },
    data: { currentVacancies: vacancies },
  });
  return activity;
}

const activityRepository = {
  create,
  findById,
  findAll,
  findAllByDate,
  updateVacancies,
};

export default activityRepository;
