import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';

import { Fibonacci } from './fibonacci';
import { Math } from '../../services/math';

class MockMath {
  calculateFibonacci = vi.fn().mockReturnValue([0, 1, 1, 2, 3]);
}

class MockRouter {
  navigate = vi.fn();
}

describe('Fibonacci Component', () => {
  let fixture: ComponentFixture<Fibonacci>;
  let component: Fibonacci;
  let math: MockMath;
  let router: MockRouter;

  beforeEach(async () => {
    math = new MockMath();
    router = new MockRouter();

    await TestBed.configureTestingModule({
      imports: [Fibonacci],
      providers: [
        { provide: Math, useValue: math },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Fibonacci);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call math.calculateFibonacci when updateFibonacci is called', () => {
    component.n = 5;
    component.updateFibonacci();

    expect(math.calculateFibonacci).toHaveBeenCalledWith(5);
  });

  it('should navigate to /dashboard when goToDashboard is called', () => {
    component.goToDashboard();

    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should render placeholder text when no fibonacci numbers exist', () => {
    component.fibonacci = [];
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    expect(element.textContent).toContain('Keine Daten vorhanden');
  });

  it('should render fibonacci numbers when available', () => {
    component.fibonacci = [0, 1, 1, 2];
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    expect(element.textContent).toContain('0, 1, 1, 2');
  });

  it('should update fibonacci when input changes', () => {
    component.n = 5;

    // simulate update
    component.updateFibonacci();
    fixture.detectChanges();

    expect(component.fibonacci.length).toBeGreaterThan(0);
  });
});
