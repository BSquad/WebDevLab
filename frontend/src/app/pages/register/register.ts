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

      const user: User = {
        id: 0,
        name: this.username,
        email: this.email,
        password: this.password
      };

      this.registerSuccess = await this.registerService.canUserRegister(user);

      if (this.registerSuccess) {
        await this.registerService.registerUser(user);
        this.router.navigate(['/dashboard']);
        this.toast.show('Registration successful!', 'success');
      } else {
        this.registerError = true;
        this.toast.show('Registration failed.', 'error');
      }
    }
  }
}
