import Joi from 'joi';
import { InputBookingBody } from '@/protocols';

export const roomIdSchema = Joi.object<InputBookingBody>({
  roomId: Joi.number().integer().min(1).required(),
});
