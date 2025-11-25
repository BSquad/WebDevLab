import { Routes } from '@angular/router';
import { MyDashboard } from './dashboard/my-dashboard/my-dashboard';
import { AuthorInfo } from './dashboard/author-info/author-info';
import { Fibonacci } from './dashboard/fibonacci/fibonacci';
import { ParticipiantList } from './lists/participiant-list/participiant-list';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: MyDashboard },
  { path: 'author-info', component: AuthorInfo },
  { path: 'fibonacci', component: Fibonacci },
  { path: 'participiant-list', component: ParticipiantList },
];
