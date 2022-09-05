import { ApplicationError } from '@/protocols';

export function notFoundHotelError(): ApplicationError {
  return {
    name: 'NotFoundError',
    message: 'This hotel does not exist!',
  };
}

export function InexistentHotelsError(): ApplicationError {
  return {
    name: 'NotFoundError',
    message: 'No hotel found!',
  };
}
