import express from "express";
import type { ErrorRequestHandler } from "express";
import cors from "cors";
import { AuthController } from "./controller/auth-controller.js";
import { GameController } from "./controller/game-controller.js";
import { Db } from "./db.js";
import { GuideController } from "./controller/guide-controller.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const db = new Db();
await db.initDB();

const authController = new AuthController();
const gameController = new GameController();
const guideController = new GuideController();

app.post("/api/login", authController.login);
app.post("/api/register", authController.register);
app.post("/api/create-guide", guideController.createGuide);
app.post("/api/achievements/:achievementId/complete", gameController.completeAchievement);
app.get("/api/games", gameController.getGames);
app.get("/api/games/user/:userId", gameController.getGames);
app.get("/api/games/:gameId", gameController.getGameById);
app.get("/api/games/:gameId/user/:userId", gameController.getGameById);
app.get("/api/games/:gameId/achievements", gameController.getAchievementsByGameId);
app.get("/api/games/:gameId/achievements/user/:userId", gameController.getAchievementsByGameId);
app.get("/api/guides/:gameId", guideController.getGuidesByGameId);
app.post("/api/games/:gameId/track", gameController.toggleTrackGame);

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message ?? "Unknown server error" });
};

app.use(errorHandler);

app.listen(PORT, () => console.log(`Backend läuft auf http://localhost:${PORT}`));
