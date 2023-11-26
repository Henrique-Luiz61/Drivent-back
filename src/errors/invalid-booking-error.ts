import { ApplicationError } from '@/protocols';

export function invalidBookingError(): ApplicationError {
  return {
    name: 'InvalidBookingError',
    message: 'Booking requirements failed!',
  };
}
