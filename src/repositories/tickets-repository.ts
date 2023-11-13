import { prisma } from '@/config';

async function findTicketTypes() {
  return prisma.ticketType.findMany();
}

async function findTickets(enrollmentId: number) {
  return prisma.ticket.findUnique({
    where: { enrollmentId },
    include: { TicketType: true },
  });
}

export const ticketsRepository = {
  findTicketTypes,
  findTickets,
};
