import jwt from 'jsonwebtoken';
import { ClaimsJwt } from '../api/utils/claims.jwt';
import config from '../config/config';
import { UnauthorizedError } from '../utils/errors';
import logger from '../utils/logger';

const { JWT_ENCRYPTION, JWT_EXPIRATION } = config;

export const encode = (userId: number, isMobile?: boolean) => {
    const secret = JWT_ENCRYPTION as jwt.Secret;
    const claims: ClaimsJwt = {
        userId,
    }
    return jwt.sign(claims, secret, !isMobile ? { expiresIn: JWT_EXPIRATION } : undefined);
}

export const decode = (token: string): ClaimsJwt => {
    const secret = JWT_ENCRYPTION as jwt.Secret;
    try {
        const payload = jwt.verify(token, secret) as ClaimsJwt;
        return payload;
    }
    catch (error) {
        logger.error(error.message);
        throw new UnauthorizedError('Invalid token');
    }
}