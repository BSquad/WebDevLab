import { Component } from '@angular/core';
import { ToastService } from '../../services/toast-service';
import { AuthService } from '../../services/auth-service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { RegisterData } from '../../../../../shared/models/register-data';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterModule],
  templateUrl: './register-page.html',
  styleUrl: './register-page.scss',
})
export class RegisterPage {
  constructor(
    private router: Router,
    private authService: AuthService,
    private toast: ToastService) { }

  username: string = '';
  email: string = '';
  password: string = '';

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
    }
    catch (err: any) {
      this.toast.showError('Registration error: ' + err.message);
      return;
    }
  }
}
