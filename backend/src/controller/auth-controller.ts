import type { Request, Response } from 'express';
import { addUser, getUserByName } from '../services/user-service.ts';

export async function login(req: Request, res: Response) {
  const { name, passwordHash } = req.body;

  console.log(`Login attempt for user: ${name} with hash: ${passwordHash}`);

  if (!name || !passwordHash) {
    return res.status(400).json({ success: false });
  }

  const user = await getUserByName(name);

  if (!user || user.passwordHash !== passwordHash) {
    return res.status(401).json({ success: false });
  }

  res.json({ success: true });
}

export async function register(req: Request, res: Response) {
  const { name, email, passwordHash } = req.body;

  if (!name || !email || !passwordHash) {
    return res.status(400).json({ success: false });
  }

  await addUser(name, email, passwordHash);
  res.json({ success: true });
}
