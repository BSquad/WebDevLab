
import type { User } from '../../../shared/models/user.ts';
import { Db } from '../db.ts';

export class AuthDbAccess {
  private db: Db = new Db();

  addUser = async (name: string, email: string, passwordHash: string) => {
    await this.db.executeSQL(
      `INSERT INTO USERS (NAME, EMAIL, PASSWORDHASH) VALUES (?, ?, ?)`,
      [name, email, passwordHash]
    );
  }

  getUserByNameAndPW = async (name: string, passwordHash: string): Promise<User | null> => {
    return await this.db.executeSQL(`SELECT * FROM USERS WHERE NAME = ? AND PASSWORDHASH = ?`, [name, passwordHash], true) as User;
  }
}