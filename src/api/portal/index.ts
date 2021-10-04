import { Router } from "express";
import users from "./users/route";
import practices from "./practices/route";
import patients from "./patients/route";
import permissions from "./permissions/route";

const router: Router = Router();
router.use("/users", users);
router.use("/practices", practices);
router.use("/patients", patients);
router.use("/permissions", permissions);

export default router;
