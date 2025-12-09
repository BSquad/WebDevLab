import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { LoginService } from '../../services/login-service';
import { ToastService } from '../../services/toast-service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
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

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.submitted = true;
      this.loginError = false;

      this.loginSuccess = this.loginService.validateCredentials(this.username, this.password);

      if (this.loginSuccess) {
        this.router.navigate(['/dashboard']);
        this.toast.show('Login successful!', 'success');
      } else {
        this.loginError = true;
        this.toast.show('Incorrect username or password.', 'error');
      }
    }
  }
}