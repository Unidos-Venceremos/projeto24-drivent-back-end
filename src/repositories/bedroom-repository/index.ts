import { prisma } from '@/config';
import { Bedroom } from '@prisma/client';
import { BedroomWithGuests } from '@/services/bedrooms-service';

export type CreateBedroom = Omit<Bedroom, 'id'>;

export async function insertBedroom(bedroomData: CreateBedroom): Promise<Bedroom> {
  return prisma.bedroom.create({ data: bedroomData });
}

export async function getBedrooms(): Promise<Bedroom[]> {
  return prisma.bedroom.findMany();
}

export async function getBedroomsWithGuests(): Promise<BedroomWithGuests[]> {
  return prisma.bedroom.findMany({ include: { guests: true } });
}

export async function getBedroomById(id: number, hotelId: number): Promise<BedroomWithGuests> {
  return prisma.bedroom.findFirst({
    where: { id, hotelId },
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

export async function availableBedroom(id: number): Promise<BedroomWithGuests> {
  return prisma.bedroom.update({ where: { id }, data: { available: true }, include: { guests: true } });
}
