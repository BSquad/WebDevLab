import { TestBed } from '@angular/core/testing';

import { Utility } from './utility';

describe('Utility', () => {
  let service: Utility;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Utility);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should calculate first n Fibonacci numbers', () => {
    const result = service.calculateFibonacci(5);
    expect(result).toEqual([0, 1, 1, 2, 3]);
  });

  it('should return empty array for n = 0', () => {
    const result = service.calculateFibonacci(0);
    expect(result).toEqual([]);
  });

  it('should return empty array for negative n', () => {
    const result = service.calculateFibonacci(-3);
    expect(result).toEqual([]);
  });

  it('should return [0] for n = 1', () => {
    const result = service.calculateFibonacci(1);
    expect(result).toEqual([0]);
  });
});
