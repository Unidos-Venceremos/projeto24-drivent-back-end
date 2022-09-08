import { ApplicationError } from '@/protocols';

export function notFoundBedroomError(): ApplicationError {
  return {
    name: 'NotFoundError',
    message: 'This bedroom does not exist!',
  };
}

export function bedroomDoesntMatchWithHotelError(): ApplicationError {
  return {
    name: 'ConflictError',
    message: 'This bedroom does not match with the hotel!',
  };
}

export function notAvailableBedroomError(): ApplicationError {
  return {
    name: 'NotFoundError',
    message: 'This bedroom is not available!',
  };
}

export function repeatedBedroom(): ApplicationError {
  return {
    name: 'ConflictError',
    message: 'The user bedroom is the same you are trying to register!',
  };
}
