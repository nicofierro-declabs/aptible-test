import { BaseError } from './BaseError';

export class NotFoundError extends BaseError {
  constructor(message?: any, errorPlace?: string) {
    super('NotFound', message || 'Resource not found', 404, errorPlace);
  }
}
