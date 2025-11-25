import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Math } from '../../services/math';

@Component({
  selector: 'app-fibonacci',
  imports: [FormsModule, CommonModule],
  providers: [Math],
  templateUrl: './fibonacci.html',
  styleUrl: './fibonacci.scss',
  standalone: true,
})
export class Fibonacci {
 n: number = 0;
  fibonacci: number[] = [];

  constructor(private math: Math, private router: Router) { }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  updateFibonacci() {
    this.fibonacci = this.math.calculateFibonacci(this.n);
  }
}
