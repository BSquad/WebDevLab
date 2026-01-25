import type { Request, Response } from 'express';
import { GameService } from '../services/game-service.ts';

export class GameController {
  private gameService: GameService = new GameService();

  listGames = async(req: Request, res: Response) => {
    try {
      const games = await this.gameService.getAllGames();
      res.json(games);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Fehler beim Laden der Games' });
    }
  }
}
