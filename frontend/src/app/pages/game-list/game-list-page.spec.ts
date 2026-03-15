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

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load games on init', async () => {
        await component.ngOnInit();

        expect(gameService.getGames).toHaveBeenCalledWith(1);
        expect(gameService.getPopularGames).toHaveBeenCalled();
        expect(component.games()).toEqual(MOCK_GAMES);
        expect(component.popularGames()).toEqual(MOCK_POPULAR_GAMES);
    });

    it('should navigate to game details', () => {
        component.goToGame(42);
        expect(router.navigate).toHaveBeenCalledWith(['/games', 42]);
    });

    it('should toggle game tracking', async () => {
        const game: Game = MOCK_GAMES[0];
        component.games.set([game]);

        const event = { stopPropagation: jasmine.createSpy('stopPropagation') } as unknown as Event;

        await component.toggleTrackGame(game, event);

        expect(event.stopPropagation).toHaveBeenCalled();
        expect(gameService.toggleTrackGame).toHaveBeenCalledWith(1, 1, false);
        expect(component.games()[0].isTracked).toBe(true);
    });

    it('should return image path from PathBuilder', () => {
        const path = component.getGameImagePath('cover.png');
        expect(pathBuilder.getGameImagePath).toHaveBeenCalledWith('cover.png');
        expect(path).toBe('/uploads/images/cover.png');
    });

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

    it('should handle error during ngOnInit', async () => {
        gameService.getGames.and.rejectWith(new Error('Network error'));

        await component.ngOnInit();

        expect(toastService.showError).toHaveBeenCalledWith('Error: Network error');
    });

    it('should handle toggle game tracking failure', async () => {
        gameService.toggleTrackGame.and.resolveTo(false);
        const game = { ...MOCK_GAMES[0], isTracked: false };
        component.games.set([game]);
        const event = { stopPropagation: jasmine.createSpy() } as any;

        await component.toggleTrackGame(game, event);

        expect(component.games()[0].isTracked).toBeFalse();
    });

    it('should return empty tags when no games', () => {
        component.games.set([]);

        const tags = component.getAllTags();

        expect(tags).toEqual([]);
    });

    it('should handle games without tags', () => {
        const gamesWithoutTags = [
            { ...MOCK_GAMES[0], tags: undefined } as unknown as Game,
            { ...MOCK_GAMES[1], tags: [] },
        ];
        component.games.set(gamesWithoutTags);

        const tags = component.getAllTags();

        expect(tags).toEqual([]);
    });

    it('should filter games with case insensitive title', () => {
        component.games.set(MOCK_GAMES);

        component.filters.title = 'ALPHA';
        expect(component.getfilteredGames().map((g) => g.id)).toEqual([1]);

        component.filters.title = 'beta';
        expect(component.getfilteredGames().map((g) => g.id)).toEqual([2]);
    });

    it('should filter games with multiple tags', () => {
        component.games.set(MOCK_GAMES);

        component.filters.tags = { rpg: true, adventure: true };
        expect(component.getfilteredGames().map((g) => g.id)).toEqual([1]);
    });

    it('should handle empty filters', () => {
        component.games.set(MOCK_GAMES);

        component.filters.title = '';
        component.filters.tags = {};
        component.filters.releaseFrom = '';
        component.filters.releaseTo = '';

        const filtered = component.getfilteredGames();
        expect(filtered.length).toBe(MOCK_GAMES.length);
        expect(filtered).toEqual(MOCK_GAMES);
    });

    it('should handle games without release date', () => {
        const gamesWithoutDate = [
            { ...MOCK_GAMES[0], releaseDate: '' },
            { ...MOCK_GAMES[1], releaseDate: undefined as any },
        ];
        component.games.set(gamesWithoutDate);

        component.filters.releaseFrom = '2023-01-01';
        component.filters.releaseTo = '2023-12-31';

        const filtered = component.getfilteredGames();
        expect(filtered.length).toBe(2);
    });

    it('should get game image path without parameter', () => {
        component.getGameImagePath();

        expect(pathBuilder.getGameImagePath).toHaveBeenCalledWith(undefined);
    });
});
