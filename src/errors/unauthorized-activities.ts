import { ApplicationError } from '@/protocols';

export function unauthorizedActivitiesError(): ApplicationError {
  return {
    name: 'UnauthorizedError',
    message: 'You can participate in all activities',
  };
}
