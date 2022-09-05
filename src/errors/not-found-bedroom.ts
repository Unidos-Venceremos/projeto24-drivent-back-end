import { ApplicationError } from '@/protocols';

export function notFoundBedroomError(): ApplicationError {
  return {
    name: 'NotFoundError',
    message: 'This bedroom does not exist!',
  };
}
