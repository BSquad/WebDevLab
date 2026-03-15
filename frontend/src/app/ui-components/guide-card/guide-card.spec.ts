import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { signal } from '@angular/core';

import { GuideCardComponent } from './guide-card';
import { Guide } from '../../../../../shared/models/guide';

describe('GuideCardComponent', () => {
    let component: GuideCardComponent;
    let fixture: ComponentFixture<GuideCardComponent>;

    const guideMock: Guide = {
        id: 1,
        userId: 1,
        gameId: 1,
        title: 'Test Guide',
        content: 'Test Content',
        author: 'Tester',
        createdAt: '2024-01-01',
        avgRating: 4.5,
        game: {
            id: 1,
            title: 'Test Game',
        } as any,
        screenshots: [],
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GuideCardComponent],
            providers: [provideRouter([])],
        }).compileComponents();
    });

    function createComponent(userId: number | null) {
        fixture = TestBed.createComponent(GuideCardComponent);
        component = fixture.componentInstance;

        component.guide = guideMock;
        component.user = signal(userId ? ({ id: userId } as any) : null);

        fixture.detectChanges();
    }

    it('should create', () => {
        createComponent(1);
        expect(component).toBeTruthy();
    });

    it('should display guide title', () => {
        createComponent(1);

        const title = fixture.debugElement.query(By.css('.guide-title')).nativeElement;

        expect(title.textContent).toContain('Test Guide');
    });

    it('should display author', () => {
        createComponent(1);

        const author = fixture.debugElement.query(By.css('.guide-author')).nativeElement;

        expect(author.textContent).toContain('Tester');
    });

    it('should display game title if available', () => {
        createComponent(1);

        const game = fixture.debugElement.query(By.css('.guide-game')).nativeElement;

        expect(game.textContent).toContain('Test Game');
    });

    it('should display rating if available', () => {
        createComponent(1);

        const rating = fixture.debugElement.query(By.css('.guide-rating')).nativeElement;

        expect(rating.textContent).toContain('4.5');
    });

    it('should show edit button if user owns guide', () => {
        createComponent(1);

        const buttons = fixture.debugElement.queryAll(By.css('.guide-actions button'));

        const editExists = buttons.some((b) => b.nativeElement.textContent.includes('Edit'));

        expect(editExists).toBeTrue();
    });

    it('should not show edit button if user is not owner', () => {
        createComponent(2);

        const buttons = fixture.debugElement.queryAll(By.css('.guide-actions button'));

        const editExists = buttons.some((b) => b.nativeElement.textContent.includes('Edit'));

        expect(editExists).toBeFalse();
    });

    it('should always show read button', () => {
        createComponent(1);

        const buttons = fixture.debugElement.queryAll(By.css('.guide-actions button'));

        const readExists = buttons.some((b) => b.nativeElement.textContent.includes('Read'));

        expect(readExists).toBeTrue();
    });
});
