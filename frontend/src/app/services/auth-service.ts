import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { AuthApi } from '../api/auth-api';
import { User } from '../../../../shared/models/user';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { isPlatformBrowser } from '@angular/common';
import { RegisterData } from '../../../../shared/models/register-data';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private currentUser = new BehaviorSubject<User | null>(null);
    currentUser$ = this.currentUser.asObservable();
    private isBrowser: boolean;

    constructor(
        private authApi: AuthApi,
        @Inject(PLATFORM_ID) private platformId: Object,
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);

        if (this.isBrowser) {
            const saved = localStorage.getItem('currentUser');
            if (saved) {
                this.currentUser.next(JSON.parse(saved));
            }
        }
    }

    async loginWithCredentials(username: string, password: string): Promise<boolean> {
        const user: User | null = await this.authApi.login(username, password);

        if (user) {
            this.currentUser.next(user);
            if (this.isBrowser) {
                localStorage.setItem('currentUser', JSON.stringify(user));
            }
            return true;
        }

        return false;
    }

    logout() {
        this.currentUser.next(null);
        if (this.isBrowser) {
            localStorage.removeItem('currentUser');
        }
    }

    async register(registerData: RegisterData): Promise<boolean> {
        const success: boolean = await this.authApi.register(registerData);

        if (success) {
            this.loginWithCredentials(registerData.name, registerData.password);
        }

        return success;
    }
}
