import { of } from 'rxjs';
import {
    MOCK_GAMES,
    MOCK_GAME,
    MOCK_USER,
    MOCK_POPULAR_GAMES,
    MOCK_ACHIEVEMENTS,
} from './mock-data.spec';

export class RouterMock {
    navigate = jasmine.createSpy('navigate');
}

export class GameServiceMock {
    getGames = jasmine.createSpy('getGames').and.resolveTo(MOCK_GAMES);
    getGame = jasmine.createSpy('getGame').and.resolveTo(MOCK_GAME);
    getPopularGames = jasmine.createSpy('getPopularGames').and.resolveTo(MOCK_POPULAR_GAMES);
    toggleTrackGame = jasmine.createSpy('toggleTrackGame').and.resolveTo(true);
    getAchievementsByGameId = jasmine
        .createSpy('getAchievementsByGameId')
        .and.resolveTo(MOCK_ACHIEVEMENTS);
    completeAchievement = jasmine.createSpy('completeAchievement').and.resolveTo(true);
    getBestUsersByGameId = jasmine.createSpy('getBestUsersByGameId').and.resolveTo([MOCK_USER]);
}

export class ToastServiceMock {
    showSuccess = jasmine.createSpy('showSuccess');
    showError = jasmine.createSpy('showError');
}

export class AuthServiceMock {
    currentUser$ = of(MOCK_USER);
    loginWithCredentials = jasmine.createSpy('loginWithCredentials').and.resolveTo(true);
}

export class PathBuilderMock {
    getGameImagePath = jasmine
        .createSpy('getGameImagePath')
        .and.callFake((imageName?: string) => `/uploads/images/${imageName || 'default.png'}`);
}

export class GuideServiceMock {
    getGuidesByGameId = jasmine.createSpy('getGuidesByGameId').and.resolveTo([]);
    getTopGuides = jasmine.createSpy('getTopGuides').and.resolveTo([]);
}

export class ActivatedRouteMock {
    snapshot = {
        paramMap: {
            get: jasmine.createSpy('get').and.returnValue('1'),
        },
    };
}
