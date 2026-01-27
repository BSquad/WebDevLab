import type { Request, Response } from 'express';
import type { User } from "../../../shared/models/user.ts";
import type { RegisterData } from '../../../shared/models/register-data.ts';
import { AuthService } from '../services/auth-service.js';

export class AuthController {
  private authService: AuthService = new AuthService();

  login = async (req: Request, res: Response) => {
    const { name, password } = req.body;
    const user: User | null = await this.authService.getUserByCredentials(name, password);
    res.json(user);
  }

  register = async (req: Request, res: Response) => {
    const registerData = req.body as RegisterData;
    await this.authService.register(registerData);
    res.json(true);
  }
}