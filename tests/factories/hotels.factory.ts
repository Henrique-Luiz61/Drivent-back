import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotel() {
  return prisma.hotel.create({
    data: {
      image: faker.image.imageUrl(),
      name: faker.name.lastName(),
    },
  });
}

export async function createRoomByHotelId(hotelId: number) {
  return prisma.room.create({
    data: {
      name: '61',
      capacity: 2,
      hotelId: hotelId,
    },
  });
}
