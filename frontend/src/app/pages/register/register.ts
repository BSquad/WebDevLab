import { Component } from '@angular/core';
import { ToastService } from '../../services/toast-service';
import { RegisterService } from '../../services/register-service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../models/user';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  constructor(
    private router: Router,
    private registerService: RegisterService,
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

      const passwordHash = await this.hashPassword(this.password);

      const user: User = {
        id: 0,
        name: this.username,
        email: this.email,
        passwordHash: passwordHash,
      };

      this.registerSuccess = await this.registerService.registerUser(user);

      if (this.registerSuccess) {
        this.router.navigate(['/dashboard']);
        this.toast.show('Registration successful!', 'success');
      } else {
        this.registerError = true;
        this.toast.show('Registration failed.', 'error');
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
