import { Routes } from '@angular/router';
import { MyDashboard } from './dashboard/my-dashboard/my-dashboard';
import { AuthorInfo } from './dashboard/author-info/author-info';
import { Fibonacci } from './dashboard/fibonacci/fibonacci';
import { ParticipantList } from './lists/participant-list/participant-list';
import { Login } from './pages/login/login';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login, data: { title: 'Login' } },
  { path: 'dashboard', component: MyDashboard, data: { title: 'Dashboard' } },
  { path: 'author-info', component: AuthorInfo, data: { title: 'Author Info' } },
  { path: 'fibonacci', component: Fibonacci, data: { title: 'Fibonacci Calculator' } },
  { path: 'participant-list', component: ParticipantList, data: { title: 'Participant List' } },
];
