import type { Achievement } from "../../../shared/models/achievement.ts";
import type { Game } from "../../../shared/models/game.ts";
import { GameDbAccess } from "../db-access/game-db-access.js";

export class GameService {
  private gameDbAccess: GameDbAccess = new GameDbAccess();

  getAllGames = async (): Promise<Game[]> => {
    return await this.gameDbAccess.getGames();
  }

  getGameById = async (gameId: number): Promise<Game> => {
    return await this.gameDbAccess.getGameById(gameId);
  }

  getAchievementsByGameId = async (gameId: number): Promise<Achievement[]> => {
    return await this.gameDbAccess.getAchievementsByGameId(gameId);
  }

  getAchievementsByGameIdForUser = async (gameId: number, userId: number): Promise<Achievement[]> => {
    return await this.gameDbAccess.getAchievementsByGameIdForUser(gameId, userId);
  }

  completeAchievement = async (achievementId: number, userId: number) => {
    await this.gameDbAccess.competeAchievement(achievementId, userId);
  }
}