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
import { MOCK_ACHIEVEMENTS, MOCK_GAME } from '../../tests/mock-data.spec';

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
});
