import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Math } from '../../services/math';

@Component({
  selector: 'app-fibonacci',
  imports: [FormsModule, CommonModule],
  templateUrl: './fibonacci.html',
  styleUrl: './fibonacci.scss',
  standalone: true,
})
export class Fibonacci {
 n: number = 0;
  fibonacci: number[] = [];

  constructor(private math: Math) { }

  updateFibonacci() {
    this.fibonacci = this.math.calculateFibonacci(this.n);
  }
}
