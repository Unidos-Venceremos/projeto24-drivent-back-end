import { prisma } from '@/config';
import { Activity } from '@prisma/client';
import { CreateActivityData } from '@/services/activities-service';

async function create(data: CreateActivityData) {
  const activity = await prisma.activity.create({ data });
  return activity;
}

async function findAll(): Promise<Activity[]> {
  const activities = await prisma.activity.findMany();
  return activities;
}

const activityRepository = {
  create,
  findAll,
};

export default activityRepository;
