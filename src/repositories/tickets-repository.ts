import { prisma } from '@/config';
import { CreateTicket } from '@/protocols';

async function findTicketTypes() {
  return prisma.ticketType.findMany();
}

async function findTickets(enrollmentId: number) {
  return prisma.ticket.findUnique({
    where: { enrollmentId },
    include: { TicketType: true },
  });
}

async function createTickets(ticket: CreateTicket) {
  return prisma.ticket.create({
    data: ticket,
    include: { TicketType: true },
  });
}

export const ticketsRepository = {
  findTicketTypes,
  findTickets,
  createTickets,
};
