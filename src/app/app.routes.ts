import { Routes } from '@angular/router';
import { MyDashboard } from './pages/my-dashboard/my-dashboard';
import { AuthorInfo } from './pages/author-info/author-info';
import { Fibonacci } from './pages/fibonacci/fibonacci';
import { ParticipantList } from './pages/list/participant-list/participant-list';
import { PersonList } from './pages/list/person-list/person-list';
import { Login } from './pages/login/login';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login, data: { title: 'Login' } },
  { path: 'dashboard', component: MyDashboard, data: { title: 'Dashboard' } },
  { path: 'author-info', component: AuthorInfo, data: { title: 'Author Info' } },
  { path: 'fibonacci', component: Fibonacci, data: { title: 'Fibonacci Calculator' } },
  { path: 'participant-list', component: ParticipantList, data: { title: 'Participant List' } },
  { path: 'person-list', component: PersonList, data: { title: 'Person List' } },
];
