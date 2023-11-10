import { ticketsRepository } from '@/repositories';

async function getTicketTypes() {
  const result = await ticketsRepository.findTicketTypes();

  return result;
}

export const ticketsService = {
  getTicketTypes,
};
