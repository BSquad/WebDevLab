import type { Request, Response } from 'express';
import { getUserByCredentials, registerUser } from '../services/auth-service.ts';
import type { User } from "../../../shared/models/user.ts";
import type { RegisterData } from '../../../shared/models/register-data.ts';

export async function login(req: Request, res: Response) {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ success: false });
  }

  const user : User | null = await getUserByCredentials(name, password);

  res.json({ user: user });
}

export async function register(req: Request, res: Response) {
  const registerData = req.body as RegisterData;
  
  if (!registerData) {
    return res.status(400).json({ success: false });
  }

  await registerUser(registerData);
  res.json({ success: true });
}
