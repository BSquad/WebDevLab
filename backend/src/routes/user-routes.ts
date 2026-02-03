import { Router } from "express";
import { UserController } from "../controller/user-controller.js";

const router = Router();
const userController = new UserController();

router.post("/analysis", userController.startUserAnalysis);

export { router as userRouter };
