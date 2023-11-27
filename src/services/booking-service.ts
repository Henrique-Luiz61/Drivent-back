import { bookingRepository, enrollmentRepository, ticketsRepository } from '@/repositories';
import { invalidBookingError } from '@/errors/invalid-booking-error';
import { invalidDataError, notFoundError } from '@/errors';
import { roomRepository } from '@/repositories/room-repository';

async function createBooking(roomId: number, userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  if (ticket.TicketType.isRemote || !ticket.TicketType.includesHotel || ticket.status !== 'PAID') {
    throw invalidBookingError();
  }

  const room = await roomRepository.findRoomById(roomId);
  if (!room) throw notFoundError();

  const countBooking = await bookingRepository.findAllCountBooking(roomId);
  if (countBooking >= room.capacity) throw invalidBookingError();

  const bookingCreated = await bookingRepository.createBooking(roomId, userId);

  return bookingCreated;
}

async function getBooking(userId: number) {
  if (!userId || isNaN(userId)) throw invalidDataError('userId');

  const booking = await bookingRepository.findBookingByUserId(userId);
  if (!booking) throw notFoundError();

  return booking;
}

async function updateBooking(userId: number, roomId: number, bookingId: string) {
  const idBooking = Number(bookingId);
  if (isNaN(idBooking)) throw invalidDataError('bookingId');

  const room = await roomRepository.findRoomById(roomId);
  if (!room) throw notFoundError();

  const countBooking = await bookingRepository.findAllCountBooking(roomId);
  if (countBooking >= room.capacity) throw invalidBookingError();

  const booking = await bookingRepository.findBookingByUserId(userId);
  if (!booking) throw invalidBookingError();

  const updatedBooking = await bookingRepository.upsertByBookingId(idBooking, roomId);
  if (!updatedBooking) throw invalidBookingError();

  return updatedBooking;
}

export const bookingService = {
  createBooking,
  getBooking,
  updateBooking,
};
