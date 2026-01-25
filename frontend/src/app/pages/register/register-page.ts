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
  submitted: boolean = false;
  registerSuccess: boolean = false;
  registerError: boolean = false;

  async onSubmit(form: NgForm) {
    if (form.valid) {
      this.submitted = true;
      this.registerError = false;

      const registerData: RegisterData = {
        name: this.username,
        email: this.email,
        password: this.password,
      };

      this.registerSuccess = await this.authService.register(registerData);

      if (this.registerSuccess) {
        this.router.navigate(['/game-list']);
        this.toast.showSuccess('Registration successful!');
      } else {
        this.registerError = true;
        this.toast.showError('Registration failed.');
      }
    }
  }
}
