import type { Request, Response } from 'express';
import { GameService } from '../services/game-service.ts';

export class GameController {
  private gameService: GameService = new GameService();

  getGames = async (req: Request, res: Response) => {
    const games = await this.gameService.getAllGames();
    res.json(games);
  }

  getGameById = async (req: Request, res: Response) => {
    const gameId = Number(req.params.id);
    const game = await this.gameService.getGameById(gameId);
    res.json(game);
  }
}