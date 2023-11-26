import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { roomIdSchema } from '@/schemas';
import { getBooking, postBooking, updateBooking } from '@/controllers';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .post('/', validateBody(roomIdSchema), postBooking)
  .get('/', getBooking)
  .put('/booking/:booking', validateBody(roomIdSchema), updateBooking);

export { bookingRouter };
