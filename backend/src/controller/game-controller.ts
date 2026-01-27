import type { Request, Response } from 'express';
import { GameService } from '../services/game-service.js';

export class GameController {
  private gameService: GameService = new GameService();

  getGames = async (req: Request, res: Response) => {
    const games = await this.gameService.getAllGames();
    res.json(games);
  }

  getGameById = async (req: Request, res: Response) => {
    const gameId = Number(req.params.gameId);
    const game = await this.gameService.getGameById(gameId);
    res.json(game);
  }

  getAchievementsByGameId = async (req: Request, res: Response) => {
    const gameId = Number(req.params.gameId);
    const userId = Number(req.params.userId) || null;
    const achievements = await this.gameService.getAchievementsByGameId(gameId, userId);
    res.json(achievements);
  }

  completeAchievement = async (req: Request, res: Response) => {
    const achievementId = Number(req.params.achievementId);
    const userId = Number(req.body.userId);
    await this.gameService.completeAchievement(achievementId, userId);
    res.json(true);
  }
}