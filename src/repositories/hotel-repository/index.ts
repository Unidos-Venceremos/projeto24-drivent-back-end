import { prisma } from '@/config';
import { Hotel } from '@prisma/client';

export type CreateHotel = Omit<Hotel, 'id'>;

export async function insertHotel(hotelData: CreateHotel): Promise<Hotel> {
  return prisma.hotel.create({ data: hotelData });
}

export async function getHotels(): Promise<Hotel[]> {
  return prisma.hotel.findMany();
}
