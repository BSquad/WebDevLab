import { executeSQL } from './db.ts';

export async function addUser(name: string, email: string, passwort: string) {
  await executeSQL(
    `INSERT INTO USER (NAME, EMAIL, PASSWORT) VALUES (?, ?, ?)`,
    [name, email, passwort]
  );
}

export async function getUsers() {
  return executeSQL(`SELECT * FROM USER`);
}

export async function getUserByEmail(email: string) {
  return executeSQL(`SELECT * FROM USER WHERE EMAIL = ?`, [email], true);
}
