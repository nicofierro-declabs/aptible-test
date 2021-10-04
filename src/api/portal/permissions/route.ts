import { Router } from "express";
import { handleErrorAsync } from "../../../middlewares/errorControl";
import { jwtMiddleware } from "../../../middlewares/jwt.middleware";
import { getAllPermissions } from "./controller";

const router: Router = Router();

router.get('/', jwtMiddleware, handleErrorAsync(getAllPermissions));

export default router;