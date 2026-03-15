import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameDetailPage } from './game-detail-page';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../services/game-service';
import { AuthService } from '../../services/auth-service';
import { GuideService } from '../../services/guide-service';
import { ToastService } from '../../services/toast-service';
import { PathBuilder } from '../../services/path-builder';
import {
    RouterMock,
    GameServiceMock,
    ToastServiceMock,
    PathBuilderMock,
    GuideServiceMock,
    ActivatedRouteMock,
    AuthServiceMock,
} from '../../tests/mock-classes.spec';
import { MOCK_GAME, MOCK_GAMES } from '../../tests/mock-data.spec';

describe('GameDetailPage', () => {
    let fixture: ComponentFixture<GameDetailPage>;
    let component: GameDetailPage;
    let route: ActivatedRouteMock;
    let router: RouterMock;
    let gameService: GameServiceMock;
    let guideService: GuideServiceMock;
    let toastService: ToastServiceMock;
    let pathBuilder: PathBuilderMock;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GameDetailPage],
            providers: [
                { provide: ActivatedRoute, useClass: ActivatedRouteMock },
                { provide: Router, useClass: RouterMock },
                { provide: GameService, useClass: GameServiceMock },
                { provide: AuthService, useClass: AuthServiceMock },
                { provide: GuideService, useClass: GuideServiceMock },
                { provide: ToastService, useClass: ToastServiceMock },
                { provide: PathBuilder, useClass: PathBuilderMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GameDetailPage);
        component = fixture.componentInstance;

        route = TestBed.inject(ActivatedRoute) as any;
        router = TestBed.inject(Router) as any;
        gameService = TestBed.inject(GameService) as any;
        guideService = TestBed.inject(GuideService) as any;
        toastService = TestBed.inject(ToastService) as any;
        pathBuilder = TestBed.inject(PathBuilder) as any;

        fixture.detectChanges();
    });

    it('should load game data on init', async () => {
        await component.ngOnInit();

        expect(route.snapshot.paramMap.get).toHaveBeenCalledWith('gameId');
        expect(gameService.getGame).toHaveBeenCalledWith(1, 1);
        expect(component.game()).toEqual(MOCK_GAMES[0]);
    });

    it('should handle error on init', async () => {
        gameService.getGame.and.rejectWith(new Error('Fetch failed'));

        await component.ngOnInit();

        expect(toastService.showError).toHaveBeenCalledWith('Error: Fetch failed');
    });

    it('should correctly identify guide owner', () => {
        const myGuide = { id: 10, userId: 1 } as any;
        const otherGuide = { id: 11, userId: 99 } as any;

        expect(component.isGuideOwner(myGuide)).toBeTrue();
        expect(component.isGuideOwner(otherGuide)).toBeFalse();
    });

    it('should toggle game tracking', async () => {
        const mockGame = { ...MOCK_GAME, isTracked: false };
        component.game.set(mockGame);
        const event = { stopPropagation: jasmine.createSpy() } as any;

        await component.toggleTrackGame(event);

        expect(gameService.toggleTrackGame).toHaveBeenCalled();
        expect(component.game()?.isTracked).toBeTrue();
    });

    it('should navigate to create guide', () => {
        component.game.set(MOCK_GAMES[0]);
        component.goToCreateGuide();

        expect(router.navigate).toHaveBeenCalledWith(['/create-guide', MOCK_GAMES[0].id], {
            state: { game: MOCK_GAMES[0] },
        });
    });

    it('should navigate to read guide', () => {
        const guide = { id: 123 } as any;
        component.goToReadGuide(guide);

        expect(router.navigate).toHaveBeenCalledWith(['/read-guide', 123]);
    });

    it('should navigate to edit guide', () => {
        const guide = { id: 456 } as any;
        component.goToEditGuide(guide);

        expect(router.navigate).toHaveBeenCalledWith(['/edit-guide', 456]);
    });

    it('should navigate to achievements', () => {
        component.game.set(MOCK_GAME);
        component.goToAchievements();

        expect(router.navigate).toHaveBeenCalledWith(['/achievements', MOCK_GAME.id]);
    });

    it('should get game image path', () => {
        component.getGameImagePath('test.png');

        expect(pathBuilder.getGameImagePath).toHaveBeenCalledWith('test.png');
    });

    it('should handle toggle tracking failure', async () => {
        gameService.toggleTrackGame.and.resolveTo(false);
        const mockGame = { ...MOCK_GAME, isTracked: false };
        component.game.set(mockGame);
        const event = { stopPropagation: jasmine.createSpy() } as any;

        await component.toggleTrackGame(event);

        expect(component.game()?.isTracked).toBeFalse();
    });

    it('should handle different gameId from route', async () => {
        route.snapshot.paramMap.get.and.returnValue('42');

        await component.ngOnInit();

        expect(gameService.getGame).toHaveBeenCalledWith(42, 1);
    });

    it('should load guides data on init', async () => {
        await component.ngOnInit();

        expect(guideService.getTopGuides).toHaveBeenCalledWith(1);
        expect(guideService.getGuidesByGameId).toHaveBeenCalledWith(1);
        expect(component.topGuides()).toBeDefined();
        expect(component.guides()).toBeDefined();
    });

    it('should handle guide service errors', async () => {
        guideService.getTopGuides.and.rejectWith(new Error('Guide error'));

        await component.ngOnInit();

        expect(toastService.showError).toHaveBeenCalledWith('Error: Guide error');
    });
});
