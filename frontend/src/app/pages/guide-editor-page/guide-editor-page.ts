import { Component, signal } from '@angular/core';
import { Game } from '../../../../../shared/models/game';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../services/toast-service';
import { GameService } from '../../services/game-service';
import { GuideService } from '../../services/guide-service';
import { FormsModule, NgForm } from '@angular/forms';
import { Guide } from '../../../../../shared/models/guide';
import { AuthService } from '../../services/auth-service';
import { User } from '../../../../../shared/models/user';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-guide-editor-page',
  imports: [FormsModule],
  templateUrl: './guide-editor-page.html',
  styleUrl: './guide-editor-page.scss',
})
export class GuideEditorPage {
  game: any = signal<Game | null>(null);
  user: any = signal<User | null>(null);
  title: string = '';
  content: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gameService: GameService,
    private authService: AuthService,
    private guideService: GuideService,
    private toastService: ToastService) {
    this.user = toSignal(this.authService.currentUser$);
  }

  async ngOnInit() {
    try {
      const gameId = Number(this.route.snapshot.paramMap.get('gameId'));
      const gameData = await this.gameService.getGame(gameId);
      this.game.set(gameData);
    } catch (err) {
      this.toastService.showError('Error: ' + err);
    }
  }

  async onSubmit(form: NgForm) {
    if (form.valid) {
      const guide: Guide = {
        title: this.title,
        content: this.content,
        gameId: this.game()?.id,
        authorId: this.user()?.id
      };

      const success = await this.guideService.createGuide(guide);

      if (success) {
        this.router.navigate(['/games', this.game()?.id]);
        this.toastService.showSuccess('Guide created successfully!');
      } else {
        this.toastService.showError('Failed to create guide.');
      }
    }
  }
}
