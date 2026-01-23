import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { GameList } from './pages/game-list/game-list';
import { Register } from './pages/register/register';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login, data: { title: 'Login' } },
  { path: 'register', component: Register, data: { title: 'Register' } },
  { path: 'game-list', component: GameList, data: { title: 'Game List' } },
];
