import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorInfo } from './author-info';

describe('AuthorInfo', () => {
  let component: AuthorInfo;
  let fixture: ComponentFixture<AuthorInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorInfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
