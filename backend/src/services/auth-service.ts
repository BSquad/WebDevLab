import type { User } from '../../../shared/models/user.ts';
import type { RegisterData } from '../../../shared/models/register-data.ts';
import { AuthDbAccess } from '../db-access/auth-db-access.js';

export class AuthService {
    private authDbAccess: AuthDbAccess = new AuthDbAccess();

    getUserByCredentials = async (
        name: string,
        password: string,
    ): Promise<User | null> => {
        const passwordHash = await this.hashPassword(password);
        return await this.authDbAccess.getUserByNameAndPWHash(
            name,
            passwordHash,
        );
    };

    register = async (registerData: RegisterData) => {
        try {
            const passwordHash = await this.hashPassword(registerData.password);
            await this.authDbAccess.addUser(
                registerData.name,
                registerData.email,
                passwordHash,
            );
        } catch (err: any) {
            if (err.code === 'SQLITE_CONSTRAINT') {
                if (err.message.includes('users.name'))
                    throw new Error('the username is already taken..');
                if (err.message.includes('users.email'))
                    throw new Error('the email address is already taken.');
                throw new Error('Name or email already taken.');
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
