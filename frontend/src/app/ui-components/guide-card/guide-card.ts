import { Component, Input, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Guide } from '../../../../../shared/models/guide';
import { AuthService } from '../../services/auth-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { User } from '../../../../../shared/models/user';

@Component({
    selector: 'app-guide-card',
    standalone: true,
    imports: [RouterLink, DatePipe, DecimalPipe],
    templateUrl: './guide-card.html',
    styleUrl: './guide-card.scss',
})
export class GuideCardComponent {
    @Input() guide!: Guide;

    user: Signal<User | null>;

    constructor(private authService: AuthService) {
        this.user = toSignal(this.authService.currentUser$, { initialValue: null });
    }
}
