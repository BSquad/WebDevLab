import { TestBed } from '@angular/core/testing';
import { GameService } from './game-service';
import { GameApi } from '../api/game-api';
import { GameServiceMock } from '../tests/mock-classes.spec';
import { MOCK_GAMES, MOCK_ACHIEVEMENTS, MOCK_POPULAR_GAMES } from '../tests/mock-data.spec';

describe('GameService', () => {
    let service: GameService;
    let gameApiMock: GameServiceMock;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GameService, { provide: GameApi, useClass: GameServiceMock }],
        });
        service = TestBed.inject(GameService);
        gameApiMock = TestBed.inject(GameApi) as any;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get games without userId', async () => {
        const promise = service.getGames();
        const result = await promise;

        expect(gameApiMock.getGames).toHaveBeenCalledWith(undefined);
        expect(result).toEqual(MOCK_GAMES);
    });

    it('should get games with userId', async () => {
        const promise = service.getGames(123);
        const result = await promise;

        expect(gameApiMock.getGames).toHaveBeenCalledWith(123);
        expect(result).toEqual(MOCK_GAMES);
    });

    it('should get single game', async () => {
        const mockGame = MOCK_GAMES[0];
        gameApiMock.getGame.and.resolveTo(mockGame);

        const promise = service.getGame(mockGame.id);
        const result = await promise;

        expect(gameApiMock.getGame).toHaveBeenCalledWith(mockGame.id, undefined);
        expect(result).toEqual(mockGame);
    });

    it('should get achievements by game id', async () => {
        const promise = service.getAchievementsByGameId(123);
        const result = await promise;

        expect(gameApiMock.getAchievementsByGameId).toHaveBeenCalledWith(123, undefined);
        expect(result).toEqual(MOCK_ACHIEVEMENTS);
    });

    it('should complete achievement', async () => {
        const promise = service.completeAchievement(789, 123, 456);
        const result = await promise;

        expect(gameApiMock.completeAchievement).toHaveBeenCalledWith(789, 123, 456);
        expect(result).toBeTrue();
    });

    it('should toggle track game', async () => {
        const promise = service.toggleTrackGame(123, 456, true);
        const result = await promise;

        expect(gameApiMock.toggleTrackGame).toHaveBeenCalledWith(123, 456, true);
        expect(result).toBeTrue();
    });

    it('should get popular games', async () => {
        const promise = service.getPopularGames();
        const result = await promise;

        expect(gameApiMock.getPopularGames).toHaveBeenCalled();
        expect(result).toEqual(MOCK_POPULAR_GAMES);
    });
});
