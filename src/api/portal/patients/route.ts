import { Router } from "express";
import { handleErrorAsync } from "../../../middlewares/errorControl";
import { jwtMiddleware } from "../../../middlewares/jwt.middleware";
import { validateBody } from "../../../middlewares/validateBody.middleware";
import { getAllPatients, postPatient } from "./controller";
import { postPatientValidator } from "./validator";

const router: Router = Router();

router.get('/', jwtMiddleware, handleErrorAsync(getAllPatients));
router.post('/', jwtMiddleware, validateBody(postPatientValidator), handleErrorAsync(postPatient));

export default router;