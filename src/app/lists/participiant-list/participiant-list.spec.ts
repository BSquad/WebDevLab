import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipiantList } from './participiant-list';

describe('ParticipiantList', () => {
  let component: ParticipiantList;
  let fixture: ComponentFixture<ParticipiantList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipiantList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipiantList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
