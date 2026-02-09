import { Component, signal, resource, inject, computed, ResourceRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { ToastService } from '../../services/toast-service';
import { AuthService } from '../../services/auth-service';
import { UserService } from '../../services/user.service';
import { AnalysisData } from '../../../../../shared/models/analysisData';
import { UserProfile } from '../../../../../shared/models/user';

@Component({
    selector: 'app-user-page',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatProgressBarModule],
    templateUrl: './user-page.html',
    styleUrl: './user-page.scss',
})
export class UserPage {
    private authService = inject(AuthService);
    private userService = inject(UserService);
    private toastService = inject(ToastService);

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
