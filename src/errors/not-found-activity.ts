import { ApplicationError } from '@/protocols';

export function notFoundActivityError(): ApplicationError {
  return {
    name: 'NotFoundError',
    message: 'Activity not found!',
  };
}
