import { prisma } from '@/config';

async function createBooking(roomId: number, userId: number) {
  const booking = await prisma.booking.create({
    data: {
      userId,
      roomId,
    },
    include: {
      Room: true,
    },
  });

  return booking;
}

async function findBookingByUserId(userId: number) {
  const booking = await prisma.booking.findUnique({
    where: { userId },
    include: { Room: true },
  });

  return booking;
}

async function findAllCountBooking(roomId: number) {
  const count = await prisma.booking.count({
    where: { roomId },
  });

  return count;
}

async function upsertByBookingId(bookingId: number, roomId: number) {
  const booking = await prisma.booking.update({
    where: { id: bookingId },
    data: { roomId },
  });

  return booking;
}

export const bookingRepository = {
  createBooking,
  findBookingByUserId,
  findAllCountBooking,
  upsertByBookingId,
};
