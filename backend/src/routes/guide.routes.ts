import { Router } from "express";
import { GuideController } from "../controller/guide-controller.js";

const router = Router();
const guideController = new GuideController();

router.post("/", guideController.createGuide);
router.get("/game/:gameId", guideController.getGuidesByGameId);
//router.get("/:guideId", guideController.getGuideById); // optional für read-guide

export { router as guideRouter };
