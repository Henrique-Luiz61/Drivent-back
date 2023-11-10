import { prisma } from '@/config';

async function findTicketTypes() {
  const ticketTypes = await prisma.ticketType.findMany();

  return ticketTypes;
}

export const ticketsRepository = {
  findTicketTypes,
};
