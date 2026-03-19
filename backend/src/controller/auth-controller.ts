import type { Request, Response } from 'express';
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

        if (!user) {
            throw createError(401, 'Invalid username or password');
        }

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

        try {
            await this.authService.register({ name, password, email });
            res.status(201).json({ message: 'User registered successfully' });
        } catch (err: any) {
            if (err.message === 'USERNAME_TAKEN') {
                throw createError(409, 'Username already taken');
            }
            if (err.message === 'EMAIL_TAKEN') {
                throw createError(409, 'Email already taken');
            }
            if (err.message === 'CONFLICT') {
                throw createError(409, 'Name or email already taken');
            }

            throw err;
        }
    };
}
