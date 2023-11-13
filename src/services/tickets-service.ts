import { notFoundError } from '@/errors';
import { enrollmentRepository, ticketsRepository } from '@/repositories';

async function getTicketTypes() {
  const ticketTypes = await ticketsRepository.findTicketTypes();

  return ticketTypes;
}

async function getTickets(userId: number) {
  const enrollmentInfo = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollmentInfo) throw notFoundError();

  const tickets = await ticketsRepository.findTickets(enrollmentInfo.id);
  if (!tickets) throw notFoundError();

  return tickets;
}

export const ticketsService = {
  getTicketTypes,
  getTickets,
};
