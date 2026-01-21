import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { LoginService } from '../../services/login-service';
import { ToastService } from '../../services/toast-service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  standalone: true,
})
export class Login {
  constructor(
    private router: Router,
    private loginService: LoginService,
    private toast: ToastService) { }

  username: string = '';
  password: string = '';
  submitted: boolean = false;
  loginSuccess: boolean = false;
  loginError: boolean = false;

  async onSubmit(form: NgForm) {
    if (form.valid) {
      this.submitted = true;
      this.loginError = false;

      const passwordHash = await this.hashPassword(this.password);

      this.loginSuccess = await this.loginService.loginWithCredentials(this.username, passwordHash);

      if (this.loginSuccess) {
        this.router.navigate(['/dashboard']);
        this.toast.show('Login successful!', 'success');
      } else {
        this.loginError = true;
        this.toast.show('Incorrect username or password.', 'error');
      }
    }
  }

  async hashPassword(password: string): Promise<string> { //TODO in Service auslagern
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}