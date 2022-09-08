import { prisma } from '@/config';
import { Bedroom } from '@prisma/client';
import { BedroomWithGuests } from '@/services/bedrooms-service';

export type CreateBedroom = Omit<Bedroom, 'id'>;

export async function insertBedroom(bedroomData: CreateBedroom): Promise<Bedroom> {
  return prisma.bedroom.create({ data: bedroomData });
}

export async function getBedrooms(): Promise<Bedroom[]> {
  return prisma.bedroom.findMany({ where: { available: true } });
}

export async function getBedroomsWithGuests(): Promise<BedroomWithGuests[]> {
  return prisma.bedroom.findMany({ where: { available: true }, include: { guests: true } });
}

export async function getBedroomById(id: number): Promise<BedroomWithGuests> {
  return prisma.bedroom.findUnique({
    where: { id },
    include: {
      guests: true,
    },
  });
}

export async function getBedroomsByHotelId(id: number): Promise<Bedroom[]> {
  return prisma.bedroom.findMany({ where: { hotelId: id } });
}

export async function updateBedroom(id: number, bedroomData: CreateBedroom): Promise<Bedroom> {
  return prisma.bedroom.update({ where: { id }, data: bedroomData });
}

export async function unavailableBedroom(id: number): Promise<BedroomWithGuests> {
  return prisma.bedroom.update({ where: { id }, data: { available: false }, include: { guests: true } });
}
