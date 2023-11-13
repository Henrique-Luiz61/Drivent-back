import { invalidDataError, notFoundError } from '@/errors';
import { CreateTicket } from '@/protocols';
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

async function postTickets(ticketTypeId: number, userId: number) {
  const enrollmentInfo = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollmentInfo) throw notFoundError();

  const enrollmentId = enrollmentInfo.id;

  if (!ticketTypeId) throw invalidDataError('ticketTypeId');

  const ticketInfo: CreateTicket = {
    enrollmentId,
    ticketTypeId,
    status: 'RESERVED',
  };

  const ticketCreated = await ticketsRepository.createTickets(ticketInfo);

  return ticketCreated;
}

export const ticketsService = {
  getTicketTypes,
  getTickets,
  postTickets,
};
