import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { LoginService } from '../../services/login-service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  standalone: true,
})
export class Login {
  constructor(private router: Router, private loginService: LoginService) { }

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
      } else {
        this.loginError = true;
      }
    }
  }
}