import type { Request, Response } from 'express';
import type { User } from "../../../shared/models/user.ts";
import type { RegisterData } from '../../../shared/models/register-data.ts';
import { AuthService } from '../services/auth-service.ts';

export class AuthController {
  private authService: AuthService = new AuthService();

  login = async(req: Request, res: Response) => {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ success: false });
    }

    const user: User | null = await this.authService.getUserByCredentials(name, password);

    res.json(user);
  }

  register = async(req: Request, res: Response) => {
    const registerData = req.body as RegisterData;

    if (!registerData) {
      return res.status(400).json({ success: false });
    }

    await this.authService.registerUser(registerData);
    res.json(true);
  }
}