import { ApplicationError } from '@/protocols';

export function invalidHotelError(): ApplicationError {
  return {
    name: 'InvalidHotelError',
    message: 'invalid hotel information',
  };
}
