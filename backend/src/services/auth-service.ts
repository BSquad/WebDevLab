import type { User } from "../../../shared/models/user.ts";
import { addUser, getUserByNameAndPW } from "../db-access/auth-db-access.ts";

export async function getUserByCredentials(name: string, passwordHash: string): Promise<User | null> {
  return await getUserByNameAndPW(name, passwordHash);
}

export async function registerUser(user: User) {
  await addUser(user);
}
