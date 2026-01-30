import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchievementPage } from './achievement-page';

describe('AchievementPage', () => {
    let component: AchievementPage;
    let fixture: ComponentFixture<AchievementPage>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AchievementPage],
        }).compileComponents();

        fixture = TestBed.createComponent(AchievementPage);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
