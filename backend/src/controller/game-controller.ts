import type { Request, Response } from "express";
import { GameService } from "../services/game-service.js";

export class GameController {
  private gameService: GameService = new GameService();

  getGames = async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId ? Number(req.query.userId) : undefined;
      const games = await this.gameService.getAllGames(userId);
      res.json(games);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  };

  getGameById = async (req: Request, res: Response) => {
    try {
      const gameId = Number(req.params.gameId);
      const userId = req.query.userId ? Number(req.query.userId) : undefined;
      const game = await this.gameService.getGameById(gameId, userId);
      res.json(game);
    } catch (err: any) {
      res.status(404).json({ message: err.message });
    }
  };

  getPopularGames = async (req: Request, res: Response) => {
    try {
      const games = await this.gameService.getPopularGames();
      res.json(games);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  };

  getAchievementsByGameId = async (req: Request, res: Response) => {
    const gameId = Number(req.params.gameId);
    const userId = req.query.userId ? Number(req.query.userId) : undefined;
    const achievements = await this.gameService.getAchievementsByGameId(
      gameId,
      userId,
    );
    res.json(achievements);
  };

  completeAchievement = async (req: Request, res: Response) => {
    const gameId = Number(req.params.gameId);
    const achievementId = Number(req.params.achievementId);
    const userId = req.query.userId ? Number(req.query.userId) : undefined;

    if (!userId) {
      return res
        .status(400)
        .json({ message: "userId query parameter is required" });
    }

    await this.gameService.completeAchievement(achievementId, userId, gameId);
    res.json(true);
  };

  toggleTrackGame = async (req: Request, res: Response) => {
    const gameId = Number(req.params.gameId);
    const userId = req.query.userId ? Number(req.query.userId) : undefined;
    const isTracked = Boolean(req.body.isTracked);

    if (!userId) {
      return res
        .status(400)
        .json({ message: "userId query parameter is required" });
    }

    await this.gameService.toggleTrackGame(gameId, userId, isTracked);
    res.json(true);
  };

  getBestUsersByGameId = async (req: Request, res: Response) => {
    const gameId = Number(req.params.gameId);
    const bestUsers = await this.gameService.getBestUsersByGameId(gameId);
    res.json(bestUsers);
  };
}
