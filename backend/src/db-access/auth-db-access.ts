
import type { User } from '../../../shared/models/user.ts';
import { executeSQL } from '../db.ts';

export async function addUser(name: string, email: string, passwordHash: string) {
  await executeSQL(
    `INSERT INTO USERS (NAME, EMAIL, PASSWORDHASH) VALUES (?, ?, ?)`,
    [name, email, passwordHash]
  );
}

export async function getUserByNameAndPW(name: string, passwordHash: string) : Promise<User | null> {
  return await executeSQL(`SELECT * FROM USERS WHERE NAME = ? AND PASSWORDHASH = ?`, [name, passwordHash], true) as User;
}