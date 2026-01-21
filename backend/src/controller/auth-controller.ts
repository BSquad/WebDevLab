import type { Request, Response } from 'express';
import { getUserByCredentials, registerUser } from '../services/auth-service.ts';
import type { User } from "../../../shared/models/user.ts";

export async function login(req: Request, res: Response) {
  const { name, passwordHash } = req.body;

  if (!name || !passwordHash) {
    return res.status(400).json({ success: false });
  }

  const user : User | null = await getUserByCredentials(name, passwordHash);

  res.json({ user: user });
}

export async function register(req: Request, res: Response) {
  const user = req.body as User;
  
  if (!user) {
    return res.status(400).json({ success: false });
  }

  await registerUser(user);
  res.json({ success: true });
}
