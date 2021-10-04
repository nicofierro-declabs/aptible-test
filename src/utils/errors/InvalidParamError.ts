import { BaseError } from './BaseError';

export class InvalidParamError extends BaseError {
  constructor(message: any, errorPlace?: string) {
    super('InvalidParams', message, 400, errorPlace);
  }
}
