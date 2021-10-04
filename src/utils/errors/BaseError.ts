export class BaseError extends Error {
  public readonly status: number;

  public readonly errorPlace?: string;

  public readonly code?: string;

  constructor(
    name: string,
    message: any,
    status: number,
    errorPlace?: string,
    code?: string,
  ) {
    super(message);
    this.name = name;
    this.status = status;
    this.errorPlace = errorPlace;
    this.code = code;
  }
}
