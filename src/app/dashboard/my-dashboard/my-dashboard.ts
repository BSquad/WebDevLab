import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Utility } from '../../utility';

@Component({
  selector: 'app-my-dashboard',
  imports: [FormsModule, CommonModule],
  providers: [Utility],
  templateUrl: './my-dashboard.html',
  styleUrl: './my-dashboard.scss',
  standalone: true,
})
export class MyDashboard {
  n: number = 0;
  fibonacci: number[] = [];

  constructor(private utility: Utility) {}

  updateFibonacci() {
    this.fibonacci = this.utility.calculateFibonacci(this.n);
  }
}
