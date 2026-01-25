import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideEditorPage } from './guide-editor-page';

describe('GuideEditorPage', () => {
  let component: GuideEditorPage;
  let fixture: ComponentFixture<GuideEditorPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuideEditorPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuideEditorPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
