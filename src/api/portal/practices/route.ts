import { Router } from "express";
import { handleErrorAsync } from "../../../middlewares/errorControl";
import { jwtMiddleware } from "../../../middlewares/jwt.middleware";
import { adminSystemRoleMiddleware } from "../../../middlewares/admin.systemRole.middleware";
import { getAllPractices, getSeatsAvailables, postPractice } from "./controller";
import { validateBody } from "../../../middlewares/validateBody.middleware";
import { postPracticeValidator } from "./validator";
import { practiceAdminMiddleware } from "../../../middlewares/practiceAdmin.systemRole.middleware";

const router: Router = Router();

router.get('/', jwtMiddleware, adminSystemRoleMiddleware, handleErrorAsync(getAllPractices));
router.post('/', jwtMiddleware, adminSystemRoleMiddleware, validateBody(postPracticeValidator), handleErrorAsync(postPractice));
router.get('/seats/:id', jwtMiddleware, practiceAdminMiddleware, handleErrorAsync(getSeatsAvailables));

export default router;