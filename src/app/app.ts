  import { Component, signal } from '@angular/core';
  import { Router, RouterOutlet, NavigationEnd, RouterModule } from '@angular/router';
  import { filter } from 'rxjs/operators';

  @Component({
    selector: 'app-root',
    imports: [RouterOutlet, RouterModule],
    templateUrl: './app.html',
    styleUrl: './app.scss',
    standalone: true,
  })
  export class App {
    currentUrl: string = '';
    pageTitle: string = '';

    constructor(private router: Router) {
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          this.currentUrl = event.urlAfterRedirects;
          this.pageTitle = this.router.routerState.snapshot.root.firstChild?.data['title'] || '';
        });
    }

    protected readonly title = signal('WebDevLab');

    showDashboardButton(): boolean {
      return this.currentUrl !== '/login' && this.currentUrl !== '/dashboard';
    }

    goToDashboard() {
      this.router.navigate(['/dashboard']);
    }
  }
