import type { Request, Response } from 'express';
import { getGames } from '../services/game-service.ts';

export async function listGames(req: Request, res: Response) {
  try {
    const games = await getGames();
    res.json(games);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fehler beim Laden der Games' });
  }
}
