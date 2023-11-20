import { TicketStatus } from '@prisma/client';
import { invalidHotelError, notFoundError } from '@/errors';
import { enrollmentRepository, ticketsRepository, hotelsRepository } from '@/repositories';

async function validateUserInfo(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  if (ticket.status === TicketStatus.RESERVED || !ticket.TicketType.includesHotel || ticket.TicketType.isRemote) {
    throw invalidHotelError();
  }
}

async function getHotels(userId: number) {
  await validateUserInfo(userId);

  const hotels = await hotelsRepository.findHotels();
  if (hotels.length === 0) throw notFoundError();

  return hotels;
}

async function getHotelRooms(userId: number, hotelId: number) {
  await validateUserInfo(userId);

  const hotelRooms = await hotelsRepository.findRoomsByHotelId(hotelId);
  if (!hotelRooms) throw notFoundError();

  return hotelRooms;
}

export const hotelsService = {
  validateUserInfo,
  getHotels,
  getHotelRooms,
};
