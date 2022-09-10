import { prisma } from '@/config';
import { ActivityUser, Activity } from '@prisma/client';

export type ActivityUserWithActivityInfo = ActivityUser & { Activity: Activity };

export type CreateActivityUserData = {
  userId: number;
  activityId: number;
};

async function create(data: CreateActivityUserData): Promise<ActivityUser> {
  const activity = await prisma.activityUser.create({ data });
  return activity;
}

async function findAllByUserId(userId: number): Promise<ActivityUserWithActivityInfo[]> {
  const activities = await prisma.activityUser.findMany({ where: { userId }, include: { Activity: true } });
  return activities;
}

async function findUserAndActivity(userId: number, activityId: number): Promise<ActivityUser[]> {
  const activity = await prisma.activityUser.findMany({ where: { AND: [{ userId }, { activityId }] } });
  return activity;
}

const activityRepository = {
  create,
  findAllByUserId,
  findUserAndActivity,
};

export default activityRepository;
