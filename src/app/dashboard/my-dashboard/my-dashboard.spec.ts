import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyDashboard } from './my-dashboard';

describe('MyDashboard', () => {
  let component: MyDashboard;
  let fixture: ComponentFixture<MyDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
