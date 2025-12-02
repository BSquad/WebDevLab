import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  standalone: true,
})
export class Login {
  constructor(private router: Router) { }

  username: string = '';
  password: string = '';
  submitted: boolean = false;

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.submitted = true;
      //TODO
      console.log('Login Daten:', { username: this.username, password: this.password });
      this.router.navigate(['/dashboard']);
    }
  }
}