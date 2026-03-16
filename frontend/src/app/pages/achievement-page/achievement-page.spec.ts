import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AchievementPage } from './achievement-page';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../services/game-service';
import { AuthService } from '../../services/auth-service';
import {
    RouterMock,
    GameServiceMock,
    AuthServiceMock,
    ActivatedRouteMock,
} from '../../tests/mock-classes.spec';
import { MOCK_ACHIEVEMENTS, MOCK_GAME } from '../../tests/mock-data.spec';
import { ToastService } from '../../services/toast-service';
import { ToastServiceMock } from '../../tests/mock-classes.spec';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('AchievementPage', () => {
    let component: AchievementPage;
    let fixture: ComponentFixture<AchievementPage>;
    let router: RouterMock;
    let gameService: GameServiceMock;
    let route: ActivatedRouteMock;
    let toastService: ToastServiceMock;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AchievementPage],
            providers: [
                { provide: Router, useClass: RouterMock },
                { provide: ActivatedRoute, useClass: ActivatedRouteMock },
                { provide: GameService, useClass: GameServiceMock },
                { provide: AuthService, useClass: AuthServiceMock },
                { provide: ToastService, useClass: ToastServiceMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AchievementPage);
        component = fixture.componentInstance;

        router = TestBed.inject(Router) as any as RouterMock;
        route = TestBed.inject(ActivatedRoute) as any as ActivatedRouteMock;
        gameService = TestBed.inject(GameService) as any as GameServiceMock;
        toastService = TestBed.inject(ToastService) as any as ToastServiceMock;

        fixture.detectChanges();
    });

    describe('Component Initialization', () => {
        it('should create component', () => {
            expect(component).toBeTruthy();
        });

        it('should load achievements on init', async () => {
            await component.ngOnInit();

            expect(gameService.getGame).toHaveBeenCalledWith(1);
            expect(gameService.getAchievementsByGameId).toHaveBeenCalledWith(1, 1);
            expect(component.game()).toEqual(MOCK_GAME);
            expect(component.achievements()).toEqual(MOCK_ACHIEVEMENTS);
        });

        it('should handle different gameId from route', async () => {
            route.snapshot.paramMap.get.and.returnValue('42');

            await component.ngOnInit();

            expect(gameService.getGame).toHaveBeenCalledWith(42);
            expect(gameService.getAchievementsByGameId).toHaveBeenCalledWith(42, 1);
        });

        it('should handle error when loading on init', async () => {
            gameService.getGame.and.rejectWith(new Error('Test Error'));

            await component.ngOnInit();

            expect(toastService.showError).toHaveBeenCalledWith('Error: Test Error');
        });
    });

    describe('Component Logic', () => {
        it('should handle achievement completion success', async () => {
            const achievementToComplete = MOCK_ACHIEVEMENTS[0];
            component.achievements.set(MOCK_ACHIEVEMENTS);
            component.game.set(MOCK_GAME);

            await component.completeAchievement(achievementToComplete);

            expect(gameService.completeAchievement).toHaveBeenCalledWith(101, 1, 1);

            const updatedAchievement = component.achievements().find((a: any) => a.id === 101);
            expect(updatedAchievement?.isCompleted).toBeTrue();
        });

        it('should handle achievement completion failure', async () => {
            gameService.completeAchievement.and.rejectWith(
                new Error('Unable to complete achievement'),
            );
            const achievementToComplete = MOCK_ACHIEVEMENTS[1];
            component.achievements.set(MOCK_ACHIEVEMENTS);
            component.game.set(MOCK_GAME);

            await component.completeAchievement(achievementToComplete);

            expect(gameService.completeAchievement).toHaveBeenCalledWith(102, 1, 1);

            const updatedAchievement = component.achievements().find((a: any) => a.id === 102);
            expect(updatedAchievement?.isCompleted).toBeFalse();

            expect(toastService.showError).toHaveBeenCalledWith(
                'Error: Unable to complete achievement',
            );
        });
    });

    describe('Navigation Methods', () => {
        it('should navigate back to game details', () => {
            component.goBack();
            expect(router.navigate).toHaveBeenCalledWith(['/games', '1']);
        });
    });

    describe('HTML Template Rendering', () => {
        it('should display achievement difficulty classes', async () => {
            await component.ngOnInit();
            fixture.detectChanges();

            const difficultyIcons = fixture.debugElement.queryAll(By.css('.achievement-icon'));
            expect(difficultyIcons[0].classes['bronze']).toBeTrue();
            expect(difficultyIcons[1].classes['silver']).toBeTrue();
        });

        it('should not display complete buttons when user is not logged in', async () => {
            const authServiceMock = TestBed.inject(AuthService) as any;
            authServiceMock.currentUser$ = of(null);

            fixture = TestBed.createComponent(AchievementPage);
            component = fixture.componentInstance;

            await component.ngOnInit();
            fixture.detectChanges();

            const completeButtons = fixture.debugElement.queryAll(
                By.css('.normal-button:not(.back-button)'),
            );
            expect(completeButtons.length).toBe(0);
        });

        it('should display empty message when no achievements', async () => {
            gameService.getAchievementsByGameId.and.resolveTo([]);
            await component.ngOnInit();
            fixture.detectChanges();

            const emptyMessage = fixture.debugElement.query(By.css('.empty-list'));
            expect(emptyMessage).toBeTruthy();
            expect(emptyMessage.nativeElement.textContent).toContain('No achievements available');
        });
    });

    describe('HTML Template Interactions', () => {
        it('should call completeAchievement when complete button is clicked', async () => {
            await component.ngOnInit();
            fixture.detectChanges();

            spyOn(component, 'completeAchievement');
            const completeButton = fixture.debugElement.query(
                By.css('.normal-button:not(.back-button)'),
            );
            completeButton.triggerEventHandler('click', null);

            expect(component.completeAchievement).toHaveBeenCalledWith(MOCK_ACHIEVEMENTS[1]);
        });

        it('should call goBack when back button is clicked', async () => {
            await component.ngOnInit();
            fixture.detectChanges();

            spyOn(component, 'goBack');
            const backButton = fixture.debugElement.query(By.css('.back-button'));
            backButton.triggerEventHandler('click', null);

            expect(component.goBack).toHaveBeenCalled();
        });
    });
});
