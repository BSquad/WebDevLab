import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideCardComponent } from './guide-card';

describe('GuideCard', () => {
    let component: GuideCardComponent;
    let fixture: ComponentFixture<GuideCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GuideCardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(GuideCardComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
