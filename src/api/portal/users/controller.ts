import 'reflect-metadata';
import { Request, Response } from 'express';
import { Container } from 'typedi';
import apiResponse from '../../utils/api-responses';
import { EditAccountInfoIn, LogInModelIn, LogInModelOut, MfaSettingsIn, MfaVerifyIn } from './dto';
import { PortalUserService } from '../../../services/PortalUserService';
import { editAccountInfoInToUser, signUpModelInToUser, teamMemberModelInToUser } from './mapper';

const portalUserService = Container.get(PortalUserService);

export const getTeamMembers = async (req: Request, res: Response): Promise<Response> => {
    const team = await portalUserService.getTeamMembers(req.claims?.userId!);
    return apiResponse.ok(res, team);
}

export const getUserByInviteGuid = async (req: Request, res: Response): Promise<Response> => {
    const { inviteGuid } = req.params;
    const numberCode = +req.headers['number-code']!;
    const user = await portalUserService.getUserByInviteGuid(inviteGuid, numberCode);
    return apiResponse.ok(res, user);
}

export const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
    const users = await portalUserService.getUsers();
    return apiResponse.ok(res, users);
};

export const postUser = async (req: Request, res: Response): Promise<Response> => {
    const newUser = signUpModelInToUser(req.body);
    newUser.systemRoleId = 3; // TODO: enum
    const user = await portalUserService.signUp(req.claims?.userId!, newUser);
    return apiResponse.ok(res, user);
}

export const postTeamMember = async (req: Request, res: Response): Promise<Response> => {
    const { inviteGuid } = req.params;
    const numberCode = +req.headers['number-code']!;
    const user = teamMemberModelInToUser(req.body);
    await portalUserService.registerTeamMember(numberCode, inviteGuid, user);
    return apiResponse.ok(res);
}

export const postInvite = async (req: Request, res: Response): Promise<Response> => {
    const newUser = teamMemberModelInToUser(req.body);
    const user = await portalUserService.registerInvite(req.claims?.userId!, newUser);
    return apiResponse.ok(res, user);
}

export const postAdminUser = async (req: Request, res: Response): Promise<Response> => {
    const newUser = signUpModelInToUser(req.body);
    newUser.systemRoleId = 1; // TODO: enum
    const user = await portalUserService.signUp(req.claims?.userId!, newUser);
    return apiResponse.ok(res, user);
}
export const postPracticeAdminUser = async (req: Request, res: Response): Promise<Response> => {
    const newUser = signUpModelInToUser(req.body);
    newUser.systemRoleId = 2; // TODO: enum
    const user = await portalUserService.signUp(req.claims?.userId!, newUser);
    return apiResponse.ok(res, user);
}

export const logIn = async (req: Request, res: Response): Promise<Response> => {
    const loginModel = req.body as LogInModelIn;
    const [user, token] = await portalUserService.logIn(loginModel.email, loginModel.password);
    res.cookie('authorization', token, { httpOnly: true });
    const result: LogInModelOut = {
        id: user.portalUserId!,
        name: `${user.firstName}`,
        email: user.email,
        role: user.systemRoleId,
        mfaEnabled: user.mfaEnabled,
        mfaSettings: user.mfaSettings
    }
    return apiResponse.ok(res, result);
}

export const putUser = async (req: Request, res: Response): Promise<Response> => {
    const { security } = req.body as EditAccountInfoIn;
    const user = editAccountInfoInToUser(req.body);
    user.portalUserId = +req.params.userId!;

    await portalUserService.editUser(req.claims?.userId!, user, security?.currentPassword, security?.confirmNewPassword);
    return apiResponse.ok(res);
};

export const getUserByToken = async (req: Request, res: Response): Promise<Response> => {
    const user = await portalUserService.getUserById(req.claims?.userId!, '[mfaSettings]');
    const result: LogInModelOut = {
        id: user.portalUserId!,
        name: `${user.firstName}`,
        email: user.email,
        role: user.systemRoleId,
        mfaEnabled: user.mfaEnabled ?? false,
        mfaSettings: user.mfaSettings,
    }
    return apiResponse.ok(res, result);
}

export const getPatientsByUser = async (req: Request, res: Response): Promise<Response> => {
    const patients = await portalUserService.getPatientsByUser(req.claims?.userId!);
    return apiResponse.ok(res, patients);
};

export const postRegisterMfaSettings = async (req: Request, res: Response): Promise<Response> => {
    const { userId, method, phoneNumber } = req.body as MfaSettingsIn;
    const mfaSettings = await portalUserService.registerMfaSettings(userId, method, phoneNumber);
    return apiResponse.ok(res, mfaSettings);
};

export const postValidateMfaToken = async (req: Request, res: Response): Promise<Response> => {
    const { userId, token } = req.body as MfaVerifyIn;
    const backupCodes = await portalUserService.validateMfaSettings(userId, token);
    if(!backupCodes){
        return apiResponse.unauthorized(res, { verified: false });
    } 
    return apiResponse.ok(res, { verified: true, backupCodes });
};

export const postVerifyToken = async (req: Request, res: Response): Promise<Response> => {
    const { userId, token } = req.body as MfaVerifyIn;
    const verify = await portalUserService.verifyUserToken(userId, token);
    if(!verify){
        return apiResponse.unauthorized(res, { verified: false });
    } 
    return apiResponse.ok(res, { verified: true });
};

export const postSendTokenSMS = async (req: Request, res: Response): Promise<Response> => {
    const { userId } = req.body;
    await portalUserService.sendSMSToken(userId);
    return apiResponse.ok(res);
};

export const getMfaBackupCodes = async (req: Request, res: Response): Promise<Response> => {
    const userId = +req.params.userId!;
    const backupCodes = await portalUserService.getMfaBackupCodes(userId);
    return apiResponse.ok(res, { backupCodes });
}

export const generateMfaBackupCodes = async (req: Request, res: Response): Promise<Response> => {
    const userId = +req.params.userId!;
    const backupCodes = await portalUserService.generateNewBackupCodes(userId);
    return apiResponse.ok(res, { backupCodes });
}