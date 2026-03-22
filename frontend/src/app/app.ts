import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { User } from '../../../shared/models/user';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { LoadingService } from './services/loading.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { environment } from '../environments/environment';

@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        RouterModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatDividerModule,
        MatProgressBarModule,
    ],
    templateUrl: './app.html',
    styleUrl: './app.scss',
    standalone: true,
})
export class App {
    protected readonly title = signal('WebDevLab');
    profileDropdownOpen = false;
    currentUrl: string = '';
    pageTitle: string = '';
    user: any = signal<User | null>(null);

    constructor(
        private router: Router,
        private authService: AuthService,
        public loadingService: LoadingService,
    ) {
        this.user = toSignal(this.authService.currentUser$);
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                this.currentUrl = event.urlAfterRedirects;
                this.profileDropdownOpen = false;
            });
    }

    goToGameList() {
        this.router.navigate(['/games']);
    }

    goToUserPage() {
        this.router.navigate(['/user']);
    }

    goToLogin() {
        this.router.navigate(['/login']);
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    toggleProfileDropdown(): void {
        this.profileDropdownOpen = !this.profileDropdownOpen;
    }

    getProfileImageUrl(path: string | null | undefined): string {
        if (!path) return 'assets/pictures/default-avatar.jpg';
        return `${environment.apiUrl}${path}`;
    }
}
