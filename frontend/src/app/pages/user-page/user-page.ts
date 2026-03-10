import { Component, signal, resource, inject, computed, ResourceRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { ToastService } from '../../services/toast-service';
import { AuthService } from '../../services/auth-service';
import { UserService } from '../../services/user.service';
import { AnalysisData } from '../../../../../shared/models/analysisData';
import { UserProfile } from '../../../../../shared/models/user';
import { RouterLink, RouterModule } from '@angular/router';
import { EditProfileDialog } from '../../components/edit-profile-dialog/edit-profile-dialog';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-user-page',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatProgressBarModule,
        MatListModule,
        RouterModule,
        RouterLink,
        MatDialogModule,
    ],
    templateUrl: './user-page.html',
    styleUrl: './user-page.scss',
})
export class UserPage {
    private authService = inject(AuthService);
    private userService = inject(UserService);
    private toastService = inject(ToastService);
    private dialog = inject(MatDialog);

    // Auth context
    currentUser = toSignal(this.authService.currentUser$);

    // UI State Signals
    isAnalyzing = signal(false);
    analysisResult = signal<AnalysisData | null>(null);

    userProfile: ResourceRef<UserProfile | null | undefined> = resource({
        params: () => ({ id: this.currentUser()?.id }),
        loader: async ({ params }) => {
            if (!params.id) return null;
            return await this.userService.getUserProfile(params.id);
        },
    });

    // Derived signals for clean template access
    games = computed(() => this.userProfile.value()?.games ?? []);
    achievements = computed(() => this.userProfile.value()?.achievements ?? []);
    guides = computed(() => this.userProfile.value()?.guides ?? []);

    toggleEditMode() {
        const currentProfile = this.userProfile.value();
        if (!currentProfile) return;

        const dialogRef = this.dialog.open(EditProfileDialog, {
            data: {
                name: currentProfile.name,
                email: currentProfile.email,
                profilePic: this.getProfileImageUrl(currentProfile.profilePicturePath), // Pass current pic for preview
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
                    formData.append('uploadType', 'user');

                    if (updatedData.file) {
                        // must match the name in the backend routes
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

    getProfileImageUrl(path: string | null | undefined): string {
        if (!path) return 'assets/pictures/default-avatar.png'; // Fallback image
        return `${environment.apiUrl}${path}`;
    }

    async startAnalysis() {
        const user = this.currentUser();
        if (!user) return;

        this.isAnalyzing.set(true);
        this.analysisResult.set(null); // Reset previous results

        try {
            // Simulate/Handle the 10s delay logic from backend
            const data = await this.userService.startUserAnalysis(user.id);
            this.analysisResult.set(data);
            this.toastService.showSuccess('Analysis Complete!');
        } catch (error) {
            this.toastService.showError('Analysis failed. Please try again.');
        } finally {
            this.isAnalyzing.set(false);
        }
    }
}
