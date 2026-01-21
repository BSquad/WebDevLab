import { Component, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { User } from '../../../shared/models/user';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true,
})
export class App {
  protected readonly title = signal('WebDevLab');
  currentUrl: string = '';
  pageTitle: string = '';
  userSignal: any = signal<User | null>(null);

  constructor(private router: Router, private authService: AuthService) {
    this.userSignal = toSignal(this.authService.currentUser$);
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.urlAfterRedirects;
        this.pageTitle = this.router.routerState.snapshot.root.firstChild?.data['title'] || '';
      });
  }

  showDashboardButton(): boolean {
    return this.currentUrl !== '/login' && this.currentUrl !== '/register' && this.currentUrl !== '/dashboard';
  }

  showHeader(): boolean {
    return this.currentUrl !== '/login' && this.currentUrl !== '/register';
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
