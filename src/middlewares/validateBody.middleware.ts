import { NextFunction, Request, Response } from 'express';
import { ObjectSchema, AlternativesSchema, ArraySchema } from 'joi';
import apiResponse from '../api/utils/api-responses';

export const validateBody = (...schemas: (ObjectSchema | AlternativesSchema | ArraySchema)[]) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let body: any = {};
  for (const schema of schemas) {
    const { error, value } = schema.options({ stripUnknown: true, convert: true }).validate(req.body);
    if (error) {
      return apiResponse.unprocessableEntity(res, error);
    }
    body = { ...body, ...value };
  }
  req.body = body;
  return next();
};