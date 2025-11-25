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

  calculateFibonacci() {
    this.fibonacci = [];
    if (this.n <= 0) return;

    let a = 0, b = 1;
    for (let i = 0; i < this.n; i++) {
      this.fibonacci.push(a);
      const next = a + b;
      a = b;
      b = next;
    }
  }
}
