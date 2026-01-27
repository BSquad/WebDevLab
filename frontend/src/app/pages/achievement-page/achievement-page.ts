import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../services/game-service';
import { Achievement } from '../../../../../shared/models/achievement';
import { Game } from '../../../../../shared/models/game';
import { AuthService } from '../../services/auth-service';
import { User } from '../../../../../shared/models/user';
import { toSignal } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-achievement-page',
  imports: [],
  templateUrl: './achievement-page.html',
  styleUrl: './achievement-page.scss',
})
export class AchievementPage {
  achievements = signal<Achievement[]>([]);
  game: any = signal<Game | null>(null);
  user: any = signal<User | null>(null);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private gameService: GameService,
    private authService: AuthService) {
    this.user = toSignal(this.authService.currentUser$);
  }

  async ngOnInit() {
    const gameId = Number(this.route.snapshot.paramMap.get('gameId'));
    const gameData = await this.gameService.getGame(gameId);
    this.game.set(gameData);
    const achievementsData = await this.gameService.getAchievementsByGameId(gameId, this.user()?.id);
    this.achievements.set(achievementsData);
  }

  goBack() {
    this.router.navigate(['/games', this.route.snapshot.paramMap.get('gameId')]);
  }

  async completeAchievement(achievementId: number) {
    const success = await this.gameService.completeAchievement(achievementId, this.user()!.id);

    if (success) {
      this.achievements.update(list =>
        list.map(a =>
          a.id === achievementId ? { ...a, isCompleted: true } : a
        )
      );
    }
  }
}
