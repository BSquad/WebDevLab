import { Router } from "express";
import { GameController } from "../controller/game-controller.js";

const router = Router();
const gameController = new GameController();

// 1️⃣ Spezifische statische Routen zuerst
router.get("/popular", gameController.getPopularGames);

// 2️⃣ Achievements-Routen
router.get("/:gameId/achievements", gameController.getAchievementsByGameId);
router.get(
  "/:gameId/achievements/user/:userId",
  gameController.getAchievementsByGameId,
);
router.post(
  "/achievements/:achievementId/complete",
  gameController.completeAchievement,
);

// 3️⃣ Game Features
router.post("/:gameId/track", gameController.toggleTrackGame);
router.get("/:gameId/best-users", gameController.getBestUsersByGameId);

// 4️⃣ User-spezifische Routen
router.get("/user/:userId", gameController.getGames);
router.get("/:gameId/user/:userId", gameController.getGameById);

// 5️⃣ Generische Game-Routen ganz am Ende
router.get("/:gameId", gameController.getGameById);
router.get("/", gameController.getGames);

export { router as gameRouter };
