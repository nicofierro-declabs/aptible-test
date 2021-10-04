import { BaseError } from './BaseError';

export class UnauthorizedError extends BaseError {
  constructor(message: any, errorPlace?: string) {
    super('Unauthorized', message, 401, errorPlace);
  }
}
