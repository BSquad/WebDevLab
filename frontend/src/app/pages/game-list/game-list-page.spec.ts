import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameListPage } from './game-list-page';

describe('GameList', () => {
    let component: GameListPage;
    let fixture: ComponentFixture<GameListPage>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GameListPage],
        }).compileComponents();

        fixture = TestBed.createComponent(GameListPage);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
