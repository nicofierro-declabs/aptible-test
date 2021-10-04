import { BaseError } from './BaseError';

export class ForbiddenError extends BaseError {
  constructor(message: any, errorPlace?: string) {
    super('Forbidden', message, 403, errorPlace);
  }
}
