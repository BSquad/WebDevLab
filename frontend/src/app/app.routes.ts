import { Routes } from '@angular/router';
import { MyDashboard } from './pages/my-dashboard/my-dashboard';
import { AuthorInfo } from './pages/author-info/author-info';
import { Fibonacci } from './pages/fibonacci/fibonacci';
import { Login } from './pages/login/login';
import { GameList } from './pages/game-list/game-list';
import { Register } from './pages/register/register';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login, data: { title: 'Login' } },
  { path: 'register', component: Register, data: { title: 'Register' } },
  { path: 'dashboard', component: MyDashboard, data: { title: 'Dashboard' } },
  { path: 'author-info', component: AuthorInfo, data: { title: 'Author Info' } },
  { path: 'fibonacci', component: Fibonacci, data: { title: 'Fibonacci Calculator' } },
  { path: 'game-list', component: GameList, data: { title: 'Game List' } },
];
