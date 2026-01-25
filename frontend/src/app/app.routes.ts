import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login-page';
import { GameListPage } from './pages/game-list/game-list-page';
import { RegisterPage } from './pages/register/register-page';
import { GameDetailPage } from './pages/game-detail-page/game-detail-page';
import { UserPage } from './pages/user-page/user-page';
import { GuideEditorPage } from './pages/guide-editor-page/guide-editor-page';

export const routes: Routes = [
  { path: '', redirectTo: '/games', pathMatch: 'full' },
  { path: 'login', component: LoginPage, data: { title: 'Login' } },
  { path: 'register', component: RegisterPage, data: { title: 'Register' } },
  { path: 'games', component: GameListPage, data: { title: 'Game List' } },
  { path: 'games/:id', component: GameDetailPage, data: { title: 'Game Detail' } },
  { path: 'user', component: UserPage, data: { title: 'User Page' } },
  { path: 'create-guide/:gameId', component: GuideEditorPage, data: { title: 'Create Guide' } },
];
