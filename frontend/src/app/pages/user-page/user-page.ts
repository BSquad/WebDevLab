import {
    Component,
    signal,
    resource,
    inject,
    computed,
    ResourceRef,
    viewChild,
    ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { GuideCardComponent } from '../../ui-components/guide-card/guide-card';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { ToastService } from '../../services/toast-service';
import { AuthService } from '../../services/auth-service';
import { UserService } from '../../services/user.service';
import { AnalysisData } from '../../../../../shared/models/analysisData';
import { UserProfile } from '../../../../../shared/models/user';
import { RouterLink, RouterModule } from '@angular/router';
import { EditProfileDialog } from '../../ui-components/edit-profile-dialog/edit-profile-dialog';
import { environment } from '../../../environments/environment';
import { PathBuilder } from '../../services/path-builder';
import { AchievementTier } from '../../../../../shared/models/achievement';

@Component({
    selector: 'app-user-page',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatListModule,
        RouterModule,
        RouterLink,
        MatDialogModule,
        GuideCardComponent,
        MatProgressBarModule,
        DragDropModule,
    ],
    templateUrl: './user-page.html',
    styleUrl: './user-page.scss',
})
export class UserPage {
    private authService = inject(AuthService);
    private userService = inject(UserService);
    private toastService = inject(ToastService);
    private dialog = inject(MatDialog);
    private pathBuilder = inject(PathBuilder);

    gameListElement = viewChild<ElementRef<HTMLDivElement>>('gameList');

    // Auth context
    currentUser = toSignal(this.authService.currentUser$);

    // UI State Signals
    layoutOrder = signal(['analysis', 'games', 'guides']);
    isAnalyzing = signal(false);
    analysisResult = signal<AnalysisData | null>(null);
    analysisProgress = signal(0);

    userProfile: ResourceRef<UserProfile | null | undefined> = resource({
        params: () => ({ id: this.currentUser()?.id }),
        loader: async ({ params }) => {
            if (!params.id) return null;
            try {
                return await this.userService.getUserProfile(params.id);
            } catch (error) {
                console.error('Failed to load user profile:', error);
                this.toastService.showError('Could not load profile data.');
                return null;
            }
        },
    });

    defaultImagePath = 'assets/pictures/default-avatar.jpg';

    games = computed(() => this.userProfile.value()?.games ?? []);
    achievements = computed(() => this.userProfile.value()?.achievements ?? []);
    guides = computed(() => this.userProfile.value()?.guides ?? []);

    groupedAchievements = computed(() => {
        const achievementList = this.achievements();

        return [
            { difficulty: AchievementTier.Platinum, title: 'Platinum' },
            { difficulty: AchievementTier.Gold, title: 'Gold' },
            { difficulty: AchievementTier.Silver, title: 'Silver' },
            { difficulty: AchievementTier.Bronze, title: 'Bronze' },
        ]
            .map((group) => ({
                ...group,
                count: achievementList.filter((a) => a.difficulty === group.difficulty).length,
            }))
            .filter((tier) => tier.count > 0);
    });

    toggleEditMode() {
        const currentProfile = this.userProfile.value();
        if (!currentProfile) return;

        const dialogRef = this.dialog.open(EditProfileDialog, {
            data: {
                name: currentProfile.name,
                email: currentProfile.email,
                profilePic: this.getProfileImageUrl(currentProfile.profilePicturePath),
            },
            width: '450px',
            panelClass: 'bg-transparent',
        });

        dialogRef.afterClosed().subscribe(async (updatedData) => {
            if (updatedData) {
                try {
                    const formData = new FormData();
                    formData.append('name', updatedData.name);
                    formData.append('email', updatedData.email);

                    if (updatedData.file) {
                        // must match the name in the backend routes
                        formData.append('uploadType', 'user');
                        formData.append('profilePic', updatedData.file);
                    }

                    await this.userService.updateUser(currentProfile.id, formData);

                    this.toastService.showSuccess('PROFILE UPDATED!');
                    this.userProfile.reload();
                } catch (error) {
                    this.toastService.showError('UPDATE FAILED');
                    console.error(error);
                }
            }
        });
    }

    scrollGames(direction: 'left' | 'right') {
        const list = this.gameListElement()?.nativeElement;
        if (!list) return;

        const scrollAmount = 300;

        list.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    }

    drop(event: CdkDragDrop<string[]>) {
        const currentLayout = [...this.layoutOrder()];
        moveItemInArray(currentLayout, event.previousIndex, event.currentIndex);
        this.layoutOrder.set(currentLayout);

        // TODO: save layout either in db or localstorage
    }

    getProfileImageUrl(path: string | null | undefined): string {
        //if (!path) return this.defaultImagePath;
        return `${environment.apiUrl}${path}`;
    }

    setDefaultProfileImage(event: Event) {
        (event.target as HTMLImageElement).src = this.defaultImagePath;
    }

    async startAnalysis() {
        const user = this.currentUser();
        if (!user) return;

        this.isAnalyzing.set(true);
        this.analysisResult.set(null);
        this.analysisProgress.set(0);

        try {
            const data = await this.userService.startUserAnalysis(user.id, (progress) => {
                this.analysisProgress.set(progress);
            });
            this.analysisResult.set(data);
            this.toastService.showSuccess('Analysis Complete!');
        } catch (error) {
            this.toastService.showError('Analysis failed. Please try again.');
        } finally {
            this.isAnalyzing.set(false);
        }
    }

    getGameImagePath(imageName?: string): string {
        return this.pathBuilder.getGameImagePath(imageName);
    }
}
