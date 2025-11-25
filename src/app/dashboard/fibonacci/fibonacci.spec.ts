import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fibonacci } from './fibonacci';

describe('Fibonacci', () => {
  let component: Fibonacci;
  let fixture: ComponentFixture<Fibonacci>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fibonacci]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Fibonacci);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
