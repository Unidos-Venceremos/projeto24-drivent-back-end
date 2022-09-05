import { prisma } from '@/config';
import { Hotel } from '@prisma/client';
import { BedroomWithGuests } from '@/services/bedrooms-service';

export type CreateHotel = Omit<Hotel, 'id'>;

export type HotelsAndBedrooms = Hotel & {
  bedrooms: BedroomWithGuests[];
};

export async function insertHotel(hotelData: CreateHotel): Promise<Hotel> {
  return prisma.hotel.create({ data: hotelData });
}

export async function getHotels(): Promise<HotelsAndBedrooms[]> {
  return prisma.hotel.findMany({ include: { bedrooms: { where: { available: true }, include: { guests: true } } } });
}

export async function getHotelById(id: number): Promise<Hotel> {
  return prisma.hotel.findUnique({ where: { id } });
}
