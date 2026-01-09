import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Math {
  calculateFibonacci(n: number): number[] {
    const fibonacci: number[] = [];
    if (n <= 0) return fibonacci;

    let a = 0, b = 1;
    for (let i = 0; i < n; i++) {
      fibonacci.push(a);
      const next = a + b;
      a = b;
      b = next;
    }

    return fibonacci;
  }
}
