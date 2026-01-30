import { Router } from "express";
import { GuideController } from "../controller/guide-controller.js";

const guideRouter = Router();
const guideController = new GuideController();

// Create guide
guideRouter.post("/", guideController.createGuide);

// Get all guides for a game
guideRouter.get("/game/:gameId", guideController.getGuidesByGameId);

export { guideRouter };
