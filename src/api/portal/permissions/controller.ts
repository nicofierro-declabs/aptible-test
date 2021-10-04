import 'reflect-metadata';
import { Container } from 'typedi';
import { Request, Response } from 'express';
import apiResponse from '../../utils/api-responses';
import { PermissionService } from '../../../services/PermissionService';

const permissionService = Container.get(PermissionService);

export const getAllPermissions = async (req: Request, res: Response): Promise<Response> => {
    const permissions = await permissionService.getPermissions(req.claims?.userId!);
    return apiResponse.ok(res, permissions);
};