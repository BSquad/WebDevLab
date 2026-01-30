import { Component, signal } from '@angular/core';
import { ToastService } from '../../services/toast-service';
import { AuthService } from '../../services/auth-service';
import { User } from '../../../../../shared/models/user';
import { toSignal } from '@angular/core/rxjs-interop';

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
    ) {
        this.user = toSignal(this.authService.currentUser$);
    }
}
