import { Router } from "express";
import { adminSystemRoleMiddleware } from "../../../middlewares/admin.systemRole.middleware";
import { handleErrorAsync } from "../../../middlewares/errorControl";
import { jwtMiddleware } from "../../../middlewares/jwt.middleware";
import { practiceAdminMiddleware } from "../../../middlewares/practiceAdmin.systemRole.middleware";
import { validateBody } from "../../../middlewares/validateBody.middleware";
import {
    getAllUsers, getPatientsByUser, getUserByToken, logIn, postAdminUser,
    putUser, postInvite, getUserByInviteGuid, postRegisterMfaSettings, postValidateMfaToken, postVerifyToken, postSendTokenSMS, postTeamMember, getMfaBackupCodes, generateMfaBackupCodes, getTeamMembers, postPracticeAdminUser,
} from "./controller";
import { logInValidator, postInviteValidator, postUserValidator, putUserValidator, registerMfaSettingsValidator, dataByUserIdValidator, verifyTokenValidator } from './validator';

const router: Router = Router();

router.get('/', jwtMiddleware, adminSystemRoleMiddleware, handleErrorAsync(getAllUsers));

// router.post('/',
//     jwtMiddleware, practiceAdminMiddleware, validateBody(postUserValidator),
//     handleErrorAsync(postUser));

router.get('/team', jwtMiddleware, practiceAdminMiddleware, handleErrorAsync(getTeamMembers));

router.post('/invite', jwtMiddleware, practiceAdminMiddleware, validateBody(postInviteValidator),
    handleErrorAsync(postInvite));

router.post('/team-member/:inviteGuid', validateBody(postInviteValidator), handleErrorAsync(postTeamMember));

router.get('/form/:inviteGuid', handleErrorAsync(getUserByInviteGuid))

router.post('/super-admin',
    jwtMiddleware, adminSystemRoleMiddleware, validateBody(postUserValidator),
    handleErrorAsync(postAdminUser));

router.post('/practice-admin',
    jwtMiddleware, adminSystemRoleMiddleware, validateBody(postUserValidator),
    handleErrorAsync(postPracticeAdminUser));

router.post('/auth', validateBody(logInValidator), handleErrorAsync(logIn));
router.put('/:userId', jwtMiddleware, validateBody(putUserValidator), handleErrorAsync(putUser));
router.get('/info', jwtMiddleware, handleErrorAsync(getUserByToken));
router.get('/patients', jwtMiddleware, handleErrorAsync(getPatientsByUser));

router.post('/register-mfa', validateBody(registerMfaSettingsValidator), handleErrorAsync(postRegisterMfaSettings));
router.post('/validate-mfa', validateBody(verifyTokenValidator), handleErrorAsync(postValidateMfaToken));
router.post('/verify-token', validateBody(verifyTokenValidator), handleErrorAsync(postVerifyToken));
router.post('/sms-token', validateBody(dataByUserIdValidator), handleErrorAsync(postSendTokenSMS));
router.get('/backup-codes/:userId', jwtMiddleware, handleErrorAsync(getMfaBackupCodes));
router.post('/backup-codes/:userId', jwtMiddleware, handleErrorAsync(generateMfaBackupCodes));

export default router;