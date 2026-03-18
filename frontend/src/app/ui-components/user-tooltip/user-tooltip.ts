import { CommonModule } from '@angular/common';
import { Component, inject, Input, signal } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserSummary } from '../../../../../shared/models/user';
import { environment } from '../../../environments/environment';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-user-tooltip',
    standalone: true,
    imports: [CommonModule, MatProgressSpinnerModule],
    templateUrl: './user-tooltip.html',
    styleUrl: './user-tooltip.scss',
})
export class UserTooltip {
    @Input({ required: true }) userId!: number;

    private userService = inject(UserService);

    isHovering = signal(false);
    userSummary = signal<any | UserSummary>(null);
    isLoading = signal(false);

    private hoverTimeout: any;
    defaultImagePath = 'assets/pictures/default-avatar.jpg';

    onMouseEnter() {
        this.hoverTimeout = setTimeout(async () => {
            this.isHovering.set(true);

            if (!this.userSummary()) {
                this.isLoading.set(true);

                try {
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                    const data = await this.userService.getUserSummary(this.userId);
                    console.log(data);
                    this.userSummary.set(data);
                } catch (error) {
                    console.error('Failed to load user summary', error);
                } finally {
                    this.isLoading.set(false);
                }
            }
        }, 500);
    }

    onMouseLeave() {
        clearTimeout(this.hoverTimeout);
        this.isHovering.set(false);
    }

    getProfileImageUrl(path: string | null | undefined): string {
        if (!path) return this.defaultImagePath;
        return `${environment.apiUrl}${path}`;
    }
}
