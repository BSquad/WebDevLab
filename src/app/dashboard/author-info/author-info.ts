import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-author-info',
  imports: [],
  templateUrl: './author-info.html',
  styleUrl: './author-info.scss',
  standalone: true
})
export class AuthorInfo {
  constructor(private router: Router) { }
goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
