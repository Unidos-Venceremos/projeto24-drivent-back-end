import { ApplicationError } from '@/protocols';

export function notFoundUserTicketError(): ApplicationError {
  return {
    name: 'NotFoundError',
    message: 'Not found user ticket!',
  };
}
