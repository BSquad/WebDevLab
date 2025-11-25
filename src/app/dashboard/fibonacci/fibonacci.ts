import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Utility } from '../../utility';

@Component({
  selector: 'app-fibonacci',
  imports: [FormsModule, CommonModule],
  providers: [Utility],
  templateUrl: './fibonacci.html',
  styleUrl: './fibonacci.scss',
  standalone: true,
})
export class Fibonacci {
 n: number = 0;
  fibonacci: number[] = [];

  constructor(private utility: Utility, private router: Router) { }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  updateFibonacci() {
    this.fibonacci = this.utility.calculateFibonacci(this.n);
  }
}
