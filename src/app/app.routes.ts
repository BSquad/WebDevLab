import { Routes } from '@angular/router';
import { MyDashboard } from './dashboard/my-dashboard/my-dashboard';
import { AuthorInfo } from './dashboard/author-info/author-info';
import { Fibonacci } from './dashboard/fibonacci/fibonacci';
import { ParticipantList } from './lists/participant-list/participant-list';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: MyDashboard },
  { path: 'author-info', component: AuthorInfo },
  { path: 'fibonacci', component: Fibonacci },
  { path: 'participant-list', component: ParticipantList },
];
