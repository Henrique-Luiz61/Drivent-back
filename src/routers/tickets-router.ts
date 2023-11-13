import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getTicketTypes, getTickets } from '@/controllers';

const ticketsRouter = Router();

ticketsRouter.all('/*', authenticateToken).post('/').get('/', getTickets).get('/types', getTicketTypes);

export { ticketsRouter };
