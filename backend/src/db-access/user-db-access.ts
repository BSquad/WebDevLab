import type { AnalysisData } from '../../../shared/models/analysisData.js';
import { User } from '../../../shared/models/user.js';
import { Db } from '../db.js';

export class UserDbAccess {
    private db: Db = new Db();

    createUser = async (name: string, email: string, passwordHash: string) =>
        await this.db.executeSQL(
            `INSERT INTO users (name, email, passwordHash) VALUES (?, ?, ?)`,
            [name, email, passwordHash],
        );

    getUserById = async (id: number) =>
        await this.db.executeSQL(
            `SELECT id, name, email, profilePicturePath FROM users WHERE id = ?`,
            [id],
            true,
        );

    getUserByNameAndPWHash = async (
        name: string,
        passwordHash: string,
    ): Promise<User | null> => {
        return (await this.db.executeSQL(
            `SELECT ID, NAME, EMAIL, PROFILEPICTUREPATH FROM USERS WHERE NAME = ? AND PASSWORDHASH = ?`,
            [name, passwordHash],
            true,
        )) as User;
    };

    getAllUsers = async () =>
        await this.db.executeSQL(
            `SELECT id, name, email, profilePicturePath FROM users`,
        );

    updateUser = async (id: number, name: string, email: string) =>
        await this.db.executeSQL(
            `UPDATE users SET name = ?, email = ? WHERE id = ?`,
            [name, email, id],
        );

    deleteUser = async (id: number) =>
        await this.db.executeSQL(`DELETE FROM users WHERE id = ?`, [id]);

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
