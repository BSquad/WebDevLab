import { addUser, getUserByNameAndPW } from "../db-access/auth-db-access.ts";

export async function isUserRegistered(name: string, passwordHash: string): Promise<boolean> {
  const user = await getUserByNameAndPW(name, passwordHash);

  if (!user) {
    return false;
  }

  return true;
}

export async function registerUser(name: string, email: string, passwordHash: string) {
  await addUser(name, email, passwordHash);
}
