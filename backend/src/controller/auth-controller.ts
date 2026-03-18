import type { Request, Response } from 'express';
import type { User } from '../../../shared/models/user.ts';
import type { RegisterData } from '../../../shared/models/register-data.ts';
import { AuthService } from '../services/auth-service.js';
import createError from 'http-errors';

export class AuthController {
    private authService: AuthService = new AuthService();

    login = async (req: Request, res: Response): Promise<void> => {
        const { name, password } = req.body;

        if (typeof name !== 'string' || typeof password !== 'string') {
            throw createError(400, 'Invalid credentials');
        }

        const user = await this.authService.getUserByCredentials(
            name,
            password,
        );

        res.status(200).json(user);
    };

    register = async (req: Request, res: Response): Promise<void> => {
        const { name, password, email } = req.body as RegisterData;

        if (
            typeof name !== 'string' ||
            typeof password !== 'string' ||
            typeof email !== 'string'
        ) {
            throw createError(400, 'Invalid registration data');
        }

        await this.authService.register({ name, password, email });

        res.status(201).json({ message: 'User registered successfully' });
    };
}
