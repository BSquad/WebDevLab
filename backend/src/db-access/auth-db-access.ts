
import type { User } from '../../../shared/models/user.ts';
import { executeSQL } from '../db.ts';

export async function addUser(user: User) {
  await executeSQL(
    `INSERT INTO USERS (NAME, EMAIL, PASSWORDHASH) VALUES (?, ?, ?)`,
    [user.name, user.email, user.passwordHash]
  );
}

export async function getUserByNameAndPW(name: string, passwordHash: string) : Promise<User | null> {
  return await executeSQL(`SELECT * FROM USERS WHERE NAME = ? AND PASSWORDHASH = ?`, [name, passwordHash], true) as User;
}