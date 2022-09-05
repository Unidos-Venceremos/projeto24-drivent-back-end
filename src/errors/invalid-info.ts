import { ApplicationError } from '@/protocols';

export function invalidIdError(id: number): ApplicationEmailError {
  return {
    name: 'InvalidIdError',
    id: id,
    message: `"${id}" is not a valid id!`,
  };
}

export type ApplicationEmailError = ApplicationError & { id: number };
