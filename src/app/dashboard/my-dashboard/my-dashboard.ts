import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-dashboard',
  imports: [],
  templateUrl: './my-dashboard.html',
  styleUrl: './my-dashboard.scss',
  standalone: true,
})
export class MyDashboard {
  constructor(private router: Router) { }

  goToAuthorInfo() {
    this.router.navigate(['/author-info']);
  }

  goToFibonacci() {
    this.router.navigate(['/fibonacci']);
  }
}
