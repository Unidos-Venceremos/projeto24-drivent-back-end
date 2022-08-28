import { prisma } from '@/config';
import { Bedroom } from '@prisma/client';

export type CreateBedroom = Omit<Bedroom, 'id'>;

export async function insertBedroom(bedroomData: CreateBedroom): Promise<Bedroom> {
  return prisma.bedroom.create({ data: bedroomData });
}

export async function getBedrooms(): Promise<Bedroom[]> {
  return prisma.bedroom.findMany({ where: { enrollmentId: null } });
}
