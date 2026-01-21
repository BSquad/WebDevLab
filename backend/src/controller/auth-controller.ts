import type { Request, Response } from 'express';
import { isUserRegistered, registerUser } from '../services/auth-service.ts';

export async function login(req: Request, res: Response) {
  const { name, passwordHash } = req.body;

  if (!name || !passwordHash) {
    return res.status(400).json({ success: false });
  }

  const isRegistered: boolean = await isUserRegistered(name, passwordHash);

  if (!isRegistered) {
    return res.status(401).json({ success: false });
  }

  res.json({ success: true });
}

export async function register(req: Request, res: Response) {
  const { name, email, passwordHash } = req.body;

  if (!name || !email || !passwordHash) {
    return res.status(400).json({ success: false });
  }

  await registerUser(name, email, passwordHash);
  res.json({ success: true });
}
