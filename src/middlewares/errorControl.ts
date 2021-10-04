import { Request, Response, NextFunction } from 'express';
import apiResponses from '../api/utils/api-responses';
import config from '../config/config';
import { InvalidDataError, InvalidParamError, UnauthorizedError } from '../utils/errors';
import { BaseError } from '../utils/errors/BaseError';
import { ForbiddenError } from '../utils/errors/ForbiddenError';
import logger from '../utils/logger';

/**
 * Catch error messages handled by user or handleErrorAsync
 */
export const errorCatcher = (
  err: any,
  _req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  _next: NextFunction,
) => {
  logger.error(err);

  res.status(err.status || 500).json({
    type: err.name,
    message: err.message,
    ...(config.NODE_ENV !== 'production' && { place: err.errorPlace }),
    code: err.code,
  });
};

/**
 * This method catches the error in an express async function and passes it
 * as an expressError to the next one in the pipe
 */
export const handleErrorAsync = (func: any) => async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await func(req, res, next);
  } catch (error) {

    if (!(error instanceof BaseError)) logger.error(error);

    if (error instanceof UnauthorizedError) apiResponses.unauthorized(res, error.message);
    if (error instanceof InvalidDataError) apiResponses.badRequest(res, error.message);
    if (error instanceof ForbiddenError) apiResponses.forbidden(res, error.message);
    if (error instanceof InvalidParamError) apiResponses.badRequest(res, error.message);

    next(error);
  }
};
