import type { User } from "../../../shared/models/user.ts";
import type { RegisterData } from '../../../shared/models/register-data.ts';
import { AuthDbAccess } from '../db-access/auth-db-access.ts';

export class AuthService {
  private authDbAccess: AuthDbAccess = new AuthDbAccess();

  getUserByCredentials = async (name: string, password: string): Promise<User | null> => {
    const passwordHash = await this.hashPassword(password);
    return await this.authDbAccess.getUserByNameAndPWHash(name, passwordHash);
  }

  register = async (registerData: RegisterData) => {
    const passwordHash = await this.hashPassword(registerData.password);
    await this.authDbAccess.addUser(registerData.name, registerData.email, passwordHash);
  }

  hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}