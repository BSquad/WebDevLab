import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { ToastService } from '../../services/toast-service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
  standalone: true,
})
export class LoginPage {
  constructor(
    private router: Router,
    private authService: AuthService,
    private toast: ToastService) { }

  username: string = '';
  password: string = '';

  async onSubmit(form: NgForm) {
    if (form.valid) {
      const success = await this.authService.loginWithCredentials(this.username, this.password);

      if (success) {
        this.router.navigate(['/games']);
        this.toast.showSuccess('Login successful!');
      } else {
        this.toast.showError('Incorrect username or password.');
      }
    }
  }
}