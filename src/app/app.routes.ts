import { Routes } from '@angular/router';
import { MyDashboard } from './dashboard/my-dashboard/my-dashboard';
import { AuthorInfo } from './dashboard/author-info/author-info';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: MyDashboard },
  { path: 'author-info', component: AuthorInfo },
];
