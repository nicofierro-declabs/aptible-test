import { NextFunction, Response, Request } from 'express';
import { Container } from 'typedi';
import apiResponses from '../api/utils/api-responses';
import { PortalUserService } from '../services/PortalUserService';
import 'reflect-metadata';

const portalUserService = Container.get(PortalUserService);

export const practiceAdminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.claims?.userId;
    if (userId) {
        const user = await portalUserService.getUserById(userId);
        if (user.systemRoleId && user.systemRoleId !== 2 && user.systemRoleId !== 1) apiResponses.unauthorized(res, 'Access denied');
        else next();
    }
}