import joi from 'joi';

export const ticketTypeIdSchema = joi.object({
  ticketTypeId: joi.number().min(1).required(),
});
