import type { Request, Response } from 'express';
import { GameService } from '../services/game-service.ts';

export class GameController {
  private gameService: GameService = new GameService();

  getGames = async(req: Request, res: Response) => {
    try {
      const games = await this.gameService.getAllGames();
      res.json(games);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error at laoding the games' });
    }
  }

  getGameById = async(req: Request, res: Response) => {
    const gameId = Number(req.params.id);
    try {
      const game = await this.gameService.getGameById(gameId);
      res.json(game);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error at loading the game' });
    }
  }
}