import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getTicketTypes, getTickets, postTickets } from '@/controllers';
import { ticketTypeIdSchema } from '@/schemas';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .post('/', validateBody(ticketTypeIdSchema), postTickets)
  .get('/', getTickets)
  .get('/types', getTicketTypes);

export { ticketsRouter };
