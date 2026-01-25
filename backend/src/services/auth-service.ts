import type { User } from "../../../shared/models/user.ts";
import { addUser, getUserByNameAndPW } from "../db-access/auth-db-access.ts";
import type { RegisterData } from '../../../shared/models/register-data.ts';

export async function getUserByCredentials(name: string, password: string): Promise<User | null> {
  const passwordHash = await hashPassword(password);
  return await getUserByNameAndPW(name, passwordHash);
}

export async function registerUser(registerData: RegisterData) {
  const passwordHash = await hashPassword(registerData.password);
  await addUser(registerData.name, registerData.email, passwordHash);
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}