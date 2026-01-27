import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login-page';
import { GameListPage } from './pages/game-list/game-list-page';
import { RegisterPage } from './pages/register/register-page';
import { GameDetailPage } from './pages/game-detail-page/game-detail-page';
import { UserPage } from './pages/user-page/user-page';
import { GuideEditorPage } from './pages/guide-editor-page/guide-editor-page';

export const routes: Routes = [
  { path: '', redirectTo: '/games', pathMatch: 'full' },
  { path: 'login', component: LoginPage },
  { path: 'register', component: RegisterPage },
  { path: 'games', component: GameListPage },
  { path: 'games/:id', component: GameDetailPage },
  { path: 'user', component: UserPage },
  { path: 'create-guide/:gameId', component: GuideEditorPage },
];
