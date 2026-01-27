
import type { User } from '../../../shared/models/user.ts';
import { Db } from '../db.js';

export class AuthDbAccess {
  private db: Db = new Db();

  addUser = async (name: string, email: string, passwordHash: string) => {
    await this.db.executeSQL(
      `INSERT INTO USERS (NAME, EMAIL, PASSWORDHASH) VALUES (?, ?, ?)`,
      [name, email, passwordHash]
    );
  }

  getUserByNameAndPWHash = async (name: string, passwordHash: string): Promise<User | null> => {
    return await this.db.executeSQL(`SELECT ID, NAME, EMAIL, PROFILEPICTUREPATH FROM USERS WHERE NAME = ? AND PASSWORDHASH = ?`, [name, passwordHash], true) as User;
  }
}