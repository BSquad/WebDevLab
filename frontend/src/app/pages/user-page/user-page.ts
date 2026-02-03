import { Component, signal } from '@angular/core';
import { ToastService } from '../../services/toast-service';
import { AuthService } from '../../services/auth-service';
import { User } from '../../../../../shared/models/user';
import { toSignal } from '@angular/core/rxjs-interop';
import { UserService } from '../../services/user-service';

@Component({
    selector: 'app-user-page',
    imports: [],
    templateUrl: './user-page.html',
    styleUrl: './user-page.scss',
})
export class UserPage {
    user: any = signal<User | null>(null);

    constructor(
        private authService: AuthService,
        private toastService: ToastService,
        private userService: UserService,
    ) {
        this.user = toSignal(this.authService.currentUser$);
    }

    async startAnalysis() {
        this.toastService.showSuccess('Starting analysis for ' + this.user()?.name);
        const analysisData = await this.userService.startUserAnalysis(this.user()!.id); //TODO progress in der UI anzeigen
        //TODO nicht über toast anzeigen
        this.toastService.showSuccess(
            'Analysis completed! \nGames played: ' +
                analysisData.gameCount +
                '\nAchievements earned: ' +
                analysisData.achievementCount +
                '\nCompletion Rate: ' +
                analysisData.completionRate +
                '%\nMost Played Genre: ' +
                analysisData.mostPlayedGenre +
                '\nCompleted Games: ' +
                analysisData.completedGameCount +
                '\nGuides Created: ' +
                analysisData.createdGuidesCount,
        );
    }
}
