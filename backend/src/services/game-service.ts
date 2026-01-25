import type { Game } from "../../../shared/models/game.ts";
import { GameDbAccess } from "../db-access/game-db-access.ts";

export class GameService {
  private gameDbAccess: GameDbAccess = new GameDbAccess();

  getAllGames = async (): Promise<Game[]> => {
    return await this.gameDbAccess.getGames();
  }

  getGameById = async (gameId: number): Promise<Game> => {
    return await this.gameDbAccess.getGameById(gameId);
  }
}