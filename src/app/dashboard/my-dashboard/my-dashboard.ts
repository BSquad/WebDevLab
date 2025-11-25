import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-dashboard',
  imports: [FormsModule, CommonModule],
  templateUrl: './my-dashboard.html',
  styleUrl: './my-dashboard.scss',
  standalone: true,
})
export class MyDashboard {
  n: number = 0;
  fibonacci: number[] = [];

  updateFibonacci() {
    this.fibonacci = this.calculateFibonacci(this.n);
  }

  calculateFibonacci(n: number) {
    const fibonacci: number[] = [];
    if (n <= 0) return fibonacci;

    let a = 0, b = 1;
    for (let i = 0; i < n; i++) {
      fibonacci.push(a);
      const next = a + b;
      a = b;
      b = next;
    }

    return fibonacci
  }
}
