import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { ToastService } from '../../services/toast-service';
import { HashService } from '../../services/hash-service';

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
    private authService: AuthService,
    private hashService: HashService,
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

      const passwordHash = await this.hashService.hashPassword(this.password);
      this.loginSuccess = await this.authService.loginWithCredentials(this.username, passwordHash);

      if (this.loginSuccess) {
        this.router.navigate(['/game-list']);
        this.toast.show('Login successful!', 'success');
      } else {
        this.loginError = true;
        this.toast.show('Incorrect username or password.', 'error');
      }
    }
  }
}