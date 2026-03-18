import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTooltip } from './user-tooltip';

describe('UserTooltip', () => {
  let component: UserTooltip;
  let fixture: ComponentFixture<UserTooltip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserTooltip]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserTooltip);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
