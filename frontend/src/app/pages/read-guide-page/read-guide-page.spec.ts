import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadGuidePage } from './read-guide-page';

describe('ReadGuidePage', () => {
  let component: ReadGuidePage;
  let fixture: ComponentFixture<ReadGuidePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadGuidePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadGuidePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
