import type { Request, Response } from 'express';
import { GameService } from '../services/game-service.js';

export class GameController {
  private gameService: GameService = new GameService();

  getGames = async (req: Request, res: Response) => {
    const userId = Number(req.params.userId) || undefined;
    const games = await this.gameService.getAllGames(userId);
    res.json(games);
  }

  getGameById = async (req: Request, res: Response) => {
    const gameId = Number(req.params.gameId);
    const userId = Number(req.params.userId) || undefined;
    const game = await this.gameService.getGameById(gameId, userId);
    res.json(game);
  }

  getAchievementsByGameId = async (req: Request, res: Response) => {
    const gameId = Number(req.params.gameId);
    const userId = Number(req.params.userId) || undefined;
    const achievements = await this.gameService.getAchievementsByGameId(gameId, userId);
    res.json(achievements);
  }

  completeAchievement = async (req: Request, res: Response) => {
    const achievementId = Number(req.params.achievementId);
    const userId = Number(req.body.userId);
    const gameId = Number(req.body.gameId);
    await this.gameService.completeAchievement(achievementId, userId, gameId);
    res.json(true);
  }

  toggleTrackGame = async (req: Request, res: Response) => {
    const gameId = Number(req.params.gameId);
    const userId = Number(req.body.userId);
    const isTracked = Boolean(req.body.isTracked);
    await this.gameService.toggleTrackGame(gameId, userId, isTracked);
    res.json(true);
  }

  getBestUsersByGameId = async (req: Request, res: Response) => {
    const gameId = Number(req.params.gameId);
    const bestUsers = await this.gameService.getBestUsersByGameId(gameId);    
    res.json(bestUsers);
  }
}