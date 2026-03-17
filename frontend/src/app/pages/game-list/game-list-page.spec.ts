import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameListPage } from './game-list-page';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GameService } from '../../services/game-service';
import { ToastService } from '../../services/toast-service';
import { PathBuilder } from '../../services/path-builder';
import { Game } from '../../../../../shared/models/game';
import { RouterMock } from '../../tests/mock-classes.spec';
import {
    GameServiceMock,
    AuthServiceMock,
    ToastServiceMock,
    PathBuilderMock,
} from '../../tests/mock-classes.spec';
import { MOCK_GAMES, MOCK_POPULAR_GAMES } from '../../tests/mock-data.spec';
import { AuthService } from '../../services/auth-service';
import { By } from '@angular/platform-browser';

describe('GameListPage', () => {
    let component: GameListPage;
    let fixture: ComponentFixture<GameListPage>;
    let router: RouterMock;
    let gameService: GameServiceMock;
    let toastService: ToastServiceMock;
    let pathBuilder: PathBuilderMock;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GameListPage, FormsModule],
            providers: [
                { provide: Router, useClass: RouterMock },
                { provide: GameService, useClass: GameServiceMock },
                { provide: AuthService, useClass: AuthServiceMock },
                { provide: ToastService, useClass: ToastServiceMock },
                { provide: PathBuilder, useClass: PathBuilderMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GameListPage);
        component = fixture.componentInstance;

        router = TestBed.inject(Router) as any as RouterMock;
        gameService = TestBed.inject(GameService) as any as GameServiceMock;
        toastService = TestBed.inject(ToastService) as any as ToastServiceMock;
        pathBuilder = TestBed.inject(PathBuilder) as any as PathBuilderMock;

        fixture.detectChanges();
    });

    describe('Component Initialization', () => {
        it('should create component', () => {
            expect(component).toBeTruthy();
        });

        it('should load games on init', async () => {
            await component.ngOnInit();

            expect(gameService.getGames).toHaveBeenCalledWith(1);
            expect(gameService.getPopularGames).toHaveBeenCalled();
            expect(component.games()).toEqual(MOCK_GAMES);
            expect(component.popularGames()).toEqual(MOCK_POPULAR_GAMES);
        });

        it('should handle error during init', async () => {
            gameService.getGames.and.rejectWith(new Error('Network error'));

            await component.ngOnInit();

            expect(toastService.showError).toHaveBeenCalledWith('Error: Network error');
        });
    });

    describe('Component Logic', () => {
        it('should collect all unique tags', () => {
            component.games.set(MOCK_POPULAR_GAMES);

            const tags = component.getAllTags();
            expect(tags.sort()).toEqual(['multiplayer', 'racing']);
        });

        it('should filter games by title, tags, and release date', () => {
            component.games.set(MOCK_GAMES);

            component.filters.title = 'alpha';
            expect(component.getfilteredGames().map((g) => g.id)).toEqual([1]);

            component.filters.title = '';
            component.filters.tags = { rpg: true };
            expect(component.getfilteredGames().map((g) => g.id)).toEqual([1]);

            component.filters.tags = {};
            component.filters.releaseFrom = '2023-02-01';
            expect(component.getfilteredGames().map((g) => g.id)).toEqual([2, 4]);

            component.filters.releaseFrom = '';
            component.filters.releaseTo = '2022-12-12';
            expect(component.getfilteredGames().map((g) => g.id)).toEqual([3]);
        });

        it('should toggle game tracking', async () => {
            const game: Game = MOCK_GAMES[0];
            component.games.set([game]);

            const event = {
                stopPropagation: jasmine.createSpy('stopPropagation'),
            } as unknown as Event;

            await component.toggleTrackGame(game, event);

            expect(event.stopPropagation).toHaveBeenCalled();
            expect(gameService.toggleTrackGame).toHaveBeenCalledWith(1, 1, false);
            expect(component.games()[0].isTracked).toBe(true);
        });

        it('should handle toggle game tracking failure', async () => {
            gameService.toggleTrackGame.and.rejectWith(new Error('Tracking failed'));
            const game = { ...MOCK_GAMES[0], isTracked: false };
            component.games.set([game]);
            const event = { stopPropagation: jasmine.createSpy() } as any;

            await component.toggleTrackGame(game, event);

            expect(toastService.showError).toHaveBeenCalledWith('Error: Tracking failed');
            expect(component.games()[0].isTracked).toBeFalse();
        });
    });

    describe('Navigation Methods', () => {
        it('should navigate to game details', () => {
            component.goToGame(42);
            expect(router.navigate).toHaveBeenCalledWith(['/games', 42]);
        });
    });

    describe('HTML Template Rendering', () => {
        it('should display popular games section', async () => {
            await component.ngOnInit();
            fixture.detectChanges();

            const popularGamesSection = fixture.debugElement.query(By.css('.popular-games-list'));
            expect(popularGamesSection).toBeTruthy();
        });

        it('should display game items', async () => {
            await component.ngOnInit();
            fixture.detectChanges();

            const gameItems = fixture.debugElement.queryAll(By.css('.game-item'));
            expect(gameItems.length).toBe(MOCK_GAMES.length);
        });

        it('should display track buttons when user is logged in', async () => {
            await component.ngOnInit();
            fixture.detectChanges();

            const trackButtons = fixture.debugElement.queryAll(By.css('.track-button'));
            expect(trackButtons.length).toBe(MOCK_GAMES.length);
        });

        it('should display filter inputs', async () => {
            fixture.detectChanges();

            const searchInput = fixture.debugElement.query(By.css('#search-title'));
            const dateFromInput = fixture.debugElement.query(By.css('#release-from'));
            const dateToInput = fixture.debugElement.query(By.css('#release-to'));

            expect(searchInput).toBeTruthy();
            expect(dateFromInput).toBeTruthy();
            expect(dateToInput).toBeTruthy();
        });

        it('should display empty message when no games', async () => {
            gameService.getGames.and.resolveTo([]);
            await component.ngOnInit();
            fixture.detectChanges();

            const emptyMessage = fixture.debugElement.query(By.css('li'));
            expect(emptyMessage).toBeTruthy();
            expect(emptyMessage.nativeElement.textContent).toContain('No games');
        });
    });

    describe('HTML Template Interactions', () => {
        it('should call goToGame when game item is clicked', async () => {
            await component.ngOnInit();
            fixture.detectChanges();

            spyOn(component, 'goToGame');
            const gameItem = fixture.debugElement.query(By.css('.game-item'));
            gameItem.triggerEventHandler('click', null);

            expect(component.goToGame).toHaveBeenCalledWith(MOCK_GAMES[0].id);
        });

        it('should call goToGame when popular game item is clicked', async () => {
            await component.ngOnInit();
            fixture.detectChanges();

            spyOn(component, 'goToGame');
            const popularGameItem = fixture.debugElement.query(By.css('.popular-game-item'));
            popularGameItem.triggerEventHandler('click', null);

            expect(component.goToGame).toHaveBeenCalledWith(MOCK_POPULAR_GAMES[0].id);
        });

        it('should call toggleTrackGame when track button is clicked', async () => {
            await component.ngOnInit();
            fixture.detectChanges();

            spyOn(component, 'toggleTrackGame');
            const trackButton = fixture.debugElement.query(By.css('.track-button'));
            trackButton.triggerEventHandler('click', null);

            expect(component.toggleTrackGame).toHaveBeenCalled();
        });

        it('should call goToGame with correct game id when game item is clicked', async () => {
            await component.ngOnInit();
            fixture.detectChanges();

            spyOn(component, 'goToGame');
            const gameItem = fixture.debugElement.query(By.css('.game-item'));
            gameItem.triggerEventHandler('click', null);

            expect(component.goToGame).toHaveBeenCalledWith(MOCK_GAMES[0].id);
        });

        it('should bind search input to filters.title', async () => {
            fixture.detectChanges();

            const searchInput = fixture.debugElement.query(By.css('#search-title'));
            searchInput.nativeElement.value = 'Test Game';
            searchInput.nativeElement.dispatchEvent(new Event('input'));

            expect(component.filters.title).toBe('Test Game');
        });

        it('should bind date inputs to filters', async () => {
            fixture.detectChanges();

            const dateFromInput = fixture.debugElement.query(By.css('#release-from'));
            const dateToInput = fixture.debugElement.query(By.css('#release-to'));

            dateFromInput.nativeElement.value = '2023-01-01';
            dateFromInput.nativeElement.dispatchEvent(new Event('input'));

            dateToInput.nativeElement.value = '2023-12-31';
            dateToInput.nativeElement.dispatchEvent(new Event('input'));

            expect(component.filters.releaseFrom).toBe('2023-01-01');
            expect(component.filters.releaseTo).toBe('2023-12-31');
        });

        it('should bind tag checkboxes to filters.tags', async () => {
            component.games.set(MOCK_GAMES);
            fixture.detectChanges();

            const tagCheckbox = fixture.debugElement.query(By.css('input[type="checkbox"]'));
            tagCheckbox.nativeElement.checked = true;
            tagCheckbox.nativeElement.dispatchEvent(new Event('change'));

            expect(component.filters.tags['rpg']).toBeTrue();
        });
    });
});
