import { executeSQL } from '../db.ts';

export async function addUser(name: string, email: string, passwordHash: string) {
  await executeSQL(
    `INSERT INTO USERS (NAME, EMAIL, PASSWORDHASH) VALUES (?, ?, ?)`,
    [name, email, passwordHash]
  );
}

export async function getUsers() {
  return await executeSQL(`SELECT * FROM USERS`);
}

export async function getUserByEmail(email: string) {
  return await executeSQL(`SELECT * FROM USERS WHERE EMAIL = ?`, [email], true);
}

export async function getUserByName(name: string) {
  return await executeSQL(`SELECT * FROM USERS WHERE NAME = ?`, [name], true);
}
