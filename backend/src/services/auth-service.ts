import type { User } from '../../../shared/models/user.ts';
import type { RegisterData } from '../../../shared/models/register-data.ts';
import { UserDbAccess } from '../db-access/user-db-access.js';
import createError from 'http-errors';

export class AuthService {
    private userdbAccess: UserDbAccess = new UserDbAccess();

    getUserByCredentials = async (
        name: string,
        password: string,
    ): Promise<User> => {
        const passwordHash = await this.hashPassword(password);

        const user = await this.userdbAccess.getUserByNameAndPWHash(
            name,
            passwordHash,
        );

        if (!user) {
            throw createError(401, 'Invalid credentials');
        }

        return user;
    };
    register = async (registerData: RegisterData): Promise<void> => {
        try {
            const passwordHash = await this.hashPassword(registerData.password);

            await this.userdbAccess.createUser(
                registerData.name,
                registerData.email,
                passwordHash,
            );
        } catch (err: any) {
            if (err.code === 'SQLITE_CONSTRAINT') {
                if (err.message.includes('users.name')) {
                    throw createError(409, 'Username already taken');
                }

                if (err.message.includes('users.email')) {
                    throw createError(409, 'Email already taken');
                }

                throw createError(409, 'Name or email already taken');
            }

            throw err;
        }
    };

    hashPassword = async (password: string): Promise<string> => {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));

        return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    };
}
