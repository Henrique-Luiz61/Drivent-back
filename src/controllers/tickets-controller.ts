import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { ticketsService } from '@/services';

export async function getTicketTypes(req: AuthenticatedRequest, res: Response) {
  const ticketTypes = await ticketsService.getTicketTypes();
  res.status(httpStatus.OK).send(ticketTypes);
}

export async function getTickets(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const tickets = await ticketsService.getTickets(userId);
  res.status(httpStatus.OK).send(tickets);
}
