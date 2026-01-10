import { executeSQL } from './db.ts';

export async function addUser(name: string, email: string, password: string) {
  await executeSQL(
    `INSERT INTO USER (NAME, EMAIL, PASSWORD) VALUES (?, ?, ?)`,
    [name, email, password]
  );
}

export async function getUsers() {
  return await executeSQL(`SELECT * FROM USER`);
}

export async function getUserByEmail(email: string) {
  return await executeSQL(`SELECT * FROM USER WHERE EMAIL = ?`, [email], true);
}

export async function getUserByName(name: string) {
  return await executeSQL(`SELECT * FROM USER WHERE NAME = ?`, [name], true);
}
