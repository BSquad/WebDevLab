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
import { MOCK_GAME, MOCK_GAMES, MOCK_GUIDE, MOCK_GUIDES } from '../../tests/mock-data.spec';
import { By } from '@angular/platform-browser';

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

    describe('Component Initialization', () => {
        it('should load game data on init', async () => {
            await component.ngOnInit();

            expect(route.snapshot.paramMap.get).toHaveBeenCalledWith('gameId');
            expect(gameService.getGame).toHaveBeenCalledWith(1, 1);
            expect(component.game()).toEqual(MOCK_GAMES[0]);
        });

        it('should load guides data on init', async () => {
            await component.ngOnInit();

            expect(guideService.getTopGuides).toHaveBeenCalledWith(1);
            expect(guideService.getGuidesByGameId).toHaveBeenCalledWith(1);
            expect(component.topGuides()).toBeDefined();
            expect(component.guides()).toBeDefined();
        });

        it('should handle error on init', async () => {
            gameService.getGame.and.rejectWith(new Error('Test Error'));

            await component.ngOnInit();

            expect(toastService.showError).toHaveBeenCalledWith('Error: Test Error');
        });
    });

    describe('Component Logic', () => {
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

        it('should handle toggle tracking failure', async () => {
            gameService.toggleTrackGame.and.rejectWith(new Error('Tracking failed'));
            const mockGame = { ...MOCK_GAME, isTracked: false };
            component.game.set(mockGame);
            const event = { stopPropagation: jasmine.createSpy() } as any;

            await component.toggleTrackGame(event);

            expect(gameService.toggleTrackGame).toHaveBeenCalled();
            expect(component.game()?.isTracked).toBeFalse();
            expect(toastService.showError).toHaveBeenCalledWith('Error: Tracking failed');
        });
    });

    describe('Navigation Methods', () => {
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
    });

    describe('HTML Template Rendering', () => {
        it('should display create guide button', async () => {
            await component.ngOnInit();
            fixture.detectChanges();

            const createButton = fixture.debugElement.query(By.css('.create-guide-button'));
            expect(createButton).toBeTruthy();
            expect(createButton.nativeElement.textContent).toContain('Create Guide');
        });

        it('should display top guides section when guides exist', async () => {
            guideService.getTopGuides.and.resolveTo([MOCK_GUIDE]);
            await component.ngOnInit();
            fixture.detectChanges();

            const topGuidesSection = fixture.debugElement.query(By.css('.top-guides-list'));
            expect(topGuidesSection).toBeTruthy();
        });

        it('should display guide card components', async () => {
            guideService.getGuidesByGameId.and.resolveTo(MOCK_GUIDES);
            await component.ngOnInit();
            fixture.detectChanges();

            const guideCards = fixture.debugElement.queryAll(By.css('app-guide-card'));
            expect(guideCards.length).toBe(MOCK_GUIDES.length);
        });

        it('should display game information', async () => {
            await component.ngOnInit();
            fixture.detectChanges();

            const description = fixture.debugElement.query(By.css('p strong'));
            expect(description.nativeElement.textContent).toContain('Description:');
        });
    });

    describe('HTML Template Interactions', () => {
        it('should call goToCreateGuide when create button is clicked', async () => {
            await component.ngOnInit();
            fixture.detectChanges();

            spyOn(component, 'goToCreateGuide');
            const createButton = fixture.debugElement.query(By.css('.create-guide-button'));
            createButton.triggerEventHandler('click', null);

            expect(component.goToCreateGuide).toHaveBeenCalled();
        });

        it('should call toggleTrackGame when track button is clicked', async () => {
            await component.ngOnInit();
            fixture.detectChanges();

            spyOn(component, 'toggleTrackGame');
            const trackButton = fixture.debugElement.query(By.css('.track-button'));
            trackButton.triggerEventHandler('click', null);

            expect(component.toggleTrackGame).toHaveBeenCalled();
        });

        it('should call goToAchievements when achievements button is clicked', async () => {
            await component.ngOnInit();
            fixture.detectChanges();

            spyOn(component, 'goToAchievements');
            const achievementsButton = fixture.debugElement.query(By.css('.normal-button'));
            achievementsButton.triggerEventHandler('click', null);

            expect(component.goToAchievements).toHaveBeenCalled();
        });
    });
});
