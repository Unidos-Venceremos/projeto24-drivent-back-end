import { ApplicationError } from '@/protocols';

export function invalidDataError(details: string[]): ApplicationInvalidateDataError {
  return {
    name: 'InvalidDataError',
    message: 'Invalid data',
    details,
  };
}

export function invalidDataErrorGeneric(): ApplicationError {
  return {
    name: 'InvalidDataError',
    message: 'Invalid data',
  };
}

type ApplicationInvalidateDataError = ApplicationError & {
  details: string[];
};
