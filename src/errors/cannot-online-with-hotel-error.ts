import { ApplicationError } from '@/protocols';

export function cannotOnlineWithHotelError(): ApplicationError {
  return {
    name: 'CannotOnlineWithHotelError',
    message: "You can't buy a ticket with hotel if you are not presential",
  };
}
