import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Finbonacci } from './finbonacci';

describe('Finbonacci', () => {
  let component: Finbonacci;
  let fixture: ComponentFixture<Finbonacci>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Finbonacci]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Finbonacci);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
