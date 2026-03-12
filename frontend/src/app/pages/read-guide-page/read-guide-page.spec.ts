import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ReadGuidePage } from './read-guide-page';

describe('ReadGuidePage', () => {
    let component: ReadGuidePage;
    let fixture: ComponentFixture<ReadGuidePage>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReadGuidePage],
            providers: [provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(ReadGuidePage);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
