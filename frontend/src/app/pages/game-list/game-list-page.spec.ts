import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameListPage } from './game-list-page';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GameService } from '../../services/game-service';
import { ToastService } from '../../services/toast-service';
import { AuthService } from '../../services/auth-service';
import { PathBuilder } from '../../services/path-builder';
import { Game } from '../../../../../shared/models/game';
import { RouterMock } from '../../tests/mock-classes.spec';
import { GameServiceMock } from '../../tests/mock-classes.spec';
import { ToastServiceMock } from '../../tests/mock-classes.spec';
import { AuthServiceMock } from '../../tests/mock-classes.spec';
import { PathBuilderMock } from '../../tests/mock-classes.spec';
import { MOCK_GAMES, MOCK_POPULAR_GAMES } from '../../tests/mock-data.spec';

describe('GameListPage', () => {
    let component: GameListPage;
    let fixture: ComponentFixture<GameListPage>;
    let router: RouterMock;
    let gameService: GameServiceMock;
    let toastService: ToastServiceMock;
    let authService: AuthService;
    let pathBuilder: PathBuilderMock;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GameListPage, FormsModule],
            providers: [
                { provide: Router, useClass: RouterMock },
                { provide: GameService, useClass: GameServiceMock },
                { provide: ToastService, useClass: ToastServiceMock },
                { provide: AuthService, useClass: AuthServiceMock },
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

    it('should load games and popularGames on ngOnInit', async () => {
        await component.ngOnInit();

        expect(gameService.getGames).toHaveBeenCalledWith(1);
        expect(gameService.getPopularGames).toHaveBeenCalled();
        expect(component.games()).toEqual(MOCK_GAMES);
        expect(component.popularGames()).toEqual(MOCK_POPULAR_GAMES);
    });

    it('should call router.navigate when goToGame is called', () => {
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
        expect(path).toBe('/images/cover.png');
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
});
