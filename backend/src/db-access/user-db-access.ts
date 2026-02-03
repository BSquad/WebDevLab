import type { AnalysisData } from "../../../shared/models/analysisData.js";
import { Db } from "../db.js";

export class UserDbAccess {
  private db: Db = new Db();

  startUserAnalysis = async (userId: number): Promise<AnalysisData> => {
    return (await this.db.executeSQL(
      `
        SELECT
          COUNT(DISTINCT ug.gameId) AS gameCount,
          COUNT(DISTINCT ua.achievementId) AS achievementCount,

          ROUND(
            CASE WHEN totalAch.total > 0 THEN COUNT(DISTINCT ua.achievementId) * 1.0 / totalAch.total ELSE 0 END,
            2
          ) AS completionRate,

          (SELECT g.genre
          FROM user_games ug
          JOIN games g ON g.id = ug.gameId
          WHERE ug.userId = u.id
          GROUP BY g.genre
          ORDER BY COUNT(*) DESC
          LIMIT 1
          ) AS mostPlayedGenre,

          COALESCE(
            (SELECT COUNT(DISTINCT ug2.gameId)
              FROM user_games ug2
              JOIN achievements a ON a.gameId = ug2.gameId
              LEFT JOIN user_achievements ua2
                ON ua2.userId = ug2.userId AND ua2.achievementId = a.id
              WHERE ug2.userId = u.id
              GROUP BY ug2.gameId
              HAVING COUNT(a.id) = COUNT(ua2.achievementId)
            ), 0
          ) AS completedGameCount,

          (SELECT COUNT(*)
          FROM guides g2
          WHERE g2.userId = u.id
          ) AS createdGuidesCount

        FROM users u
        LEFT JOIN user_games ug ON ug.userId = u.id
        LEFT JOIN user_achievements ua ON ua.userId = u.id
        CROSS JOIN (SELECT COUNT(*) AS total FROM achievements) AS totalAch
        WHERE u.id = ?
        GROUP BY u.id;
      `,
      [userId],
      true,
    )) as AnalysisData;
  };
}
