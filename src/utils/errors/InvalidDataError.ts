import { BaseError } from './BaseError';

export class InvalidDataError extends BaseError {
  constructor(message: any, errorPlace?: string) {
    super('InvalidData', message, 400, errorPlace);
  }
}
