import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameDetailPage } from './game-detail-page';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../services/game-service';
import { GuideService } from '../../services/guide-service';
import { ToastService } from '../../services/toast-service';
import { AuthService } from '../../services/auth-service';
import { PathBuilder } from '../../services/path-builder';
import {
    RouterMock,
    GameServiceMock,
    ToastServiceMock,
    AuthServiceMock,
    PathBuilderMock,
    GuideServiceMock,
    ActivatedRouteMock,
} from '../../tests/mock-classes.spec';
import { MOCK_GAME, MOCK_GAMES } from '../../tests/mock-data.spec';

describe('GameDetailPage', () => {
    let component: GameDetailPage;
    let fixture: ComponentFixture<GameDetailPage>;
    let gameService: GameServiceMock;
    let route: ActivatedRouteMock;
    let router: RouterMock;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GameDetailPage],
            providers: [
                { provide: ActivatedRoute, useClass: ActivatedRouteMock },
                { provide: Router, useClass: RouterMock },
                { provide: GameService, useClass: GameServiceMock },
                { provide: GuideService, useClass: GuideServiceMock },
                { provide: AuthService, useClass: AuthServiceMock },
                { provide: ToastService, useClass: ToastServiceMock },
                { provide: PathBuilder, useClass: PathBuilderMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GameDetailPage);
        component = fixture.componentInstance;

        gameService = TestBed.inject(GameService) as any;
        route = TestBed.inject(ActivatedRoute) as any;
        router = TestBed.inject(Router) as any;

        fixture.detectChanges();
    });

    it('should load game data on init', async () => {
        await component.ngOnInit();

        expect(route.snapshot.paramMap.get).toHaveBeenCalledWith('gameId');
        expect(gameService.getGame).toHaveBeenCalledWith(1, 1);
        expect(component.game()).toEqual(MOCK_GAMES[0]);
    });

    it('should show error toast if game loading fails', async () => {
        const toast = TestBed.inject(ToastService) as any;
        gameService.getGame.and.rejectWith(new Error('Fetch failed'));

        await component.ngOnInit();

        expect(toast.showError).toHaveBeenCalledWith('Error: Fetch failed');
    });

    it('should correctly identify guide owner', () => {
        const myGuide = { id: 10, userId: 1 } as any;
        const otherGuide = { id: 11, userId: 99 } as any;

        expect(component.isGuideOwner(myGuide)).toBeTrue();
        expect(component.isGuideOwner(otherGuide)).toBeFalse();
    });

    it('should navigate to create guide with state', () => {
        component.game.set(MOCK_GAMES[0]);
        component.goToCreateGuide();

        expect(router.navigate).toHaveBeenCalledWith(['/create-guide', MOCK_GAMES[0].id], {
            state: { game: MOCK_GAMES[0] },
        });
    });

    it('should toggle tracking and update signal', async () => {
        const mockGame = { ...MOCK_GAME, isTracked: false };
        component.game.set(mockGame);
        const event = { stopPropagation: jasmine.createSpy() } as any;

        await component.toggleTrackGame(event);

        expect(gameService.toggleTrackGame).toHaveBeenCalled();
        expect(component.game()?.isTracked).toBeTrue();
    });
});
