import { Component } from '@angular/core';
import { ToastService } from '../../services/toast-service';
import { RegisterService } from '../../services/register-service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../../../../shared/models/user';
import { HashService } from '../../services/hash-service';

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
    private hashService: HashService,
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

      const passwordHash = await this.hashService.hashPassword(this.password);

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
}
