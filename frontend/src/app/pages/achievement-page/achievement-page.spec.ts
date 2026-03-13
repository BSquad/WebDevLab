import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AchievementPage } from './achievement-page';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { GameService } from '../../services/game-service';
import { AuthService } from '../../services/auth-service';
import {
    RouterMock,
    GameServiceMock,
    AuthServiceMock,
    ActivatedRouteMock,
} from '../../tests/mock-classes.spec';
import { MOCK_ACHIEVEMENTS, MOCK_GAME, MOCK_USER } from '../../tests/mock-data.spec';
import { of } from 'rxjs';

describe('AchievementPage', () => {
    let component: AchievementPage;
    let fixture: ComponentFixture<AchievementPage>;
    let gameService: GameServiceMock;
    let router: RouterMock;
    let route: ActivatedRouteMock;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AchievementPage],
            providers: [
                { provide: Router, useClass: RouterMock },
                { provide: ActivatedRoute, useClass: ActivatedRouteMock },
                { provide: GameService, useClass: GameServiceMock },
                { provide: AuthService, useClass: AuthServiceMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AchievementPage);
        component = fixture.componentInstance;

        gameService = TestBed.inject(GameService) as any as GameServiceMock;
        router = TestBed.inject(Router) as any as RouterMock;
        route = TestBed.inject(ActivatedRoute) as any as ActivatedRouteMock;

        fixture.detectChanges();
    });

    it('should load game and achievements on init', async () => {
        await component.ngOnInit();

        expect(gameService.getGame).toHaveBeenCalledWith(1);
        expect(gameService.getAchievementsByGameId).toHaveBeenCalledWith(1, 1);
        expect(component.game()).toEqual(MOCK_GAME);
        expect(component.achievements()).toEqual(MOCK_ACHIEVEMENTS);
    });

    it('should navigate back to game details', () => {
        component.goBack();
        expect(router.navigate).toHaveBeenCalledWith(['/games', '1']);
    });

    it('should complete an achievement and update the signal', async () => {
        const achievementToComplete = MOCK_ACHIEVEMENTS[0];
        component.achievements.set(MOCK_ACHIEVEMENTS);
        component.game.set(MOCK_GAME);

        await component.completeAchievement(achievementToComplete);

        expect(gameService.completeAchievement).toHaveBeenCalledWith(101, 1, 1);

        const updatedAchievement = component.achievements().find((a: any) => a.id === 101);
        expect(updatedAchievement?.isCompleted).toBeTrue();
    });

    it('should handle achievement completion failure', async () => {
        gameService.completeAchievement.and.resolveTo(false);
        const achievementToComplete = MOCK_ACHIEVEMENTS[1];
        component.achievements.set(MOCK_ACHIEVEMENTS);
        component.game.set(MOCK_GAME);

        await component.completeAchievement(achievementToComplete);

        expect(gameService.completeAchievement).toHaveBeenCalledWith(102, 1, 1);

        const updatedAchievement = component.achievements().find((a: any) => a.id === 102);
        expect(updatedAchievement?.isCompleted).toBeFalse();
    });

    it('should handle different gameId from route params', async () => {
        route.snapshot.paramMap.get.and.returnValue('42');

        await component.ngOnInit();

        expect(gameService.getGame).toHaveBeenCalledWith(42);
        expect(gameService.getAchievementsByGameId).toHaveBeenCalledWith(42, 1);
    });

    it('should handle error when loading game', async () => {
        gameService.getGame.and.rejectWith(new Error('Game not found'));

        await expectAsync(component.ngOnInit()).toBeRejected();

        expect(gameService.getGame).toHaveBeenCalledWith(1);
    });

    it('should handle empty achievements array', async () => {
        gameService.getAchievementsByGameId.and.resolveTo([]);

        await component.ngOnInit();

        expect(component.achievements()).toEqual([]);
        expect(component.game()).toEqual(MOCK_GAME);
    });
});
