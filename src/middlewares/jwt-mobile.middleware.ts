import { Request, Response, NextFunction } from "express";
import apiResponses from "../api/utils/api-responses";
import { decode } from "../helpers/jwt.helper";
import { UnauthorizedError } from "../utils/errors";

export const jwtMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['x-auth-token'] as string;
  if(!token) apiResponses.unauthorized(res, 'Token expected.');
  else {
    try {
      const claims = decode(token);
      req.claims = claims;
      next();
    } catch (error) {
      if (error instanceof UnauthorizedError)
        apiResponses.unauthorized(res, error.message);
    }
  }
}