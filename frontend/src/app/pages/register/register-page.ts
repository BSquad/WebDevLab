import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { ToastService } from '../../services/toast-service';
import { AuthService } from '../../services/auth-service';
import { RegisterData } from '../../../../../shared/models/register-data';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        FormsModule,
        RouterModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatCardModule,
    ],
    templateUrl: './register-page.html',
    styleUrl: './register-page.scss',
})
export class RegisterPage {
    private router = inject(Router);
    private authService = inject(AuthService);
    private toast = inject(ToastService);

    username = '';
    email = '';
    password = '';

    async onSubmit(form: NgForm) {
        try {
            if (form.valid) {
                const registerData: RegisterData = {
                    name: this.username,
                    email: this.email,
                    password: this.password,
                };

                const success = await this.authService.register(registerData);
                if (success) {
                    this.router.navigate(['/games']);
                    this.toast.showSuccess('Registration successful!');
                } else {
                    this.toast.showError('Registration failed.');
                }
            }
        } catch (err: any) {
            this.toast.showError('Registration error: ' + err.message);
        }
    }
}
