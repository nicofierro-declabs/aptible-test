import { BaseError } from './BaseError';

export class SquareError extends BaseError {
  public code?: string;

  constructor(message: any, errorPlace?: string, code?: string) {
    super('Square', message, 400, errorPlace, code);
  }
}
