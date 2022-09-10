import { ApplicationError } from '@/protocols';

export function unauthorizedActivitiesError(): ApplicationError {
  return {
    name: 'UnauthorizedError',
    message: 'You can participate in all activities',
  };
}

export function unauthorizedActivityUserError(message = ''): ApplicationError {
  return {
    name: 'UnauthorizedError',
    message: message || 'This user participated in this activity',
  };
}
