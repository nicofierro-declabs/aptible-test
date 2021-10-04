import { NextFunction, Response, Request } from 'express';
import apiResponses from '../api/utils/api-responses';
import { decode, encode } from '../helpers/jwt.helper';
import { UnauthorizedError } from '../utils/errors';

export const jwtMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.authorization;
    if (!token) apiResponses.unauthorized(res, 'Expected token');
    else {
        try {
            const claims = decode(token);
            const newToken = encode(claims.userId);
            req.claims = claims;
            res.cookie('authorization', newToken, { httpOnly: true });
            next();
        }
        catch (error) {
            if (error instanceof UnauthorizedError) apiResponses.unauthorized(res, error.message);
        }
    }
}