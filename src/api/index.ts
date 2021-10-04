import { Router } from 'express';
import mobile from './mobile';
import portal from './portal';
import logger from '../utils/logger';
import { ClaimsJwt } from './utils/claims.jwt';

/**
 * 'claims' property is assigned in the jwtmiddlware adding app/portal user data using the auth token.
 */
declare global {
  namespace Express {
    interface Request {
      claims?: ClaimsJwt;
    }
  }
}

const router: Router = Router();
router.get('/', () => logger.info('[ /api ] API Listening...'));
router.use('/portal', portal);
router.use('/mobile', mobile);

export default router;