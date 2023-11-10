import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { ticketsService } from '@/services';

export async function getTicketTypes(req: AuthenticatedRequest, res: Response) {
  const ticketTypes = await ticketsService.getTicketTypes();

  res.status(httpStatus.OK).send(ticketTypes);
}
