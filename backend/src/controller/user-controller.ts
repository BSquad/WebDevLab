import type { Request, Response } from 'express';
import { addUser, getUserByName } from '../services/user-service.ts';

export async function login(req: Request, res: Response) {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ success: false });
  }

  const user = await getUserByName(name);

  if (!user || user.password !== password) {
    return res.status(401).json({ success: false });
  }

  res.json({ success: true });
}

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false });
  }

  await addUser(name, email, password);
  res.json({ success: true });
}
