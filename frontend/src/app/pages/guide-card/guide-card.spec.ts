import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { GuideCardComponent } from './guide-card';

describe('GuideCardComponent', () => {
    let component: GuideCardComponent;
    let fixture: ComponentFixture<GuideCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GuideCardComponent],
            providers: [provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(GuideCardComponent);
        component = fixture.componentInstance;

        component.guide = {
            id: 1,
            title: 'Test Guide',
        } as any;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
