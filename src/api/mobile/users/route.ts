import { Router } from 'express';
import { handleErrorAsync } from '../../../middlewares/errorControl';
import { validateBody } from '../../../middlewares/validateBody.middleware';
import { loginValidator, newPasswordFromResetValidator, patchUserValidator, resetPasswordValidator, signupValidator } from './validator';
import { getUserInfo, postAppUserSignup, postLoginAppUser, postResetPassword, patchUser, postNewPassword } from './controller';
import { jwtMiddleware } from '../../../middlewares/jwt-mobile.middleware';

const router: Router = Router();

router.get('/:userId', jwtMiddleware, handleErrorAsync(getUserInfo));
router.patch('/:userId', validateBody(patchUserValidator), jwtMiddleware, handleErrorAsync(patchUser));
router.post('/signup', validateBody(signupValidator), handleErrorAsync(postAppUserSignup));
router.post('/login', validateBody(loginValidator), handleErrorAsync(postLoginAppUser));
router.post('/reset-password', validateBody(resetPasswordValidator), handleErrorAsync(postResetPassword));
router.post('/new-password', validateBody(newPasswordFromResetValidator), handleErrorAsync(postNewPassword));

export default router;