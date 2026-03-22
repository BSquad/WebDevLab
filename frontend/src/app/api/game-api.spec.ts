import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GameApi } from './game-api';
import { Game } from '../../../../shared/models/game';
import { Achievement } from '../../../../shared/models/achievement';
import { User } from '../../../../shared/models/user';
import { MOCK_GAMES } from '../tests/mock-data.spec';

describe('GameApi', () => {
    let service: GameApi;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [GameApi],
        });
        service = TestBed.inject(GameApi);
        httpMock = TestBed.inject(HttpTestingController);

        (service as any).apiUrl = 'http://localhost:3000';
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('Game Methods', () => {
        it('should get games without userId', async () => {
            const promise = service.getGames();

            const req = httpMock.expectOne('http://localhost:3000/games');

            req.flush(MOCK_GAMES);

            const result = await promise;
            expect(result).toEqual(MOCK_GAMES);
            expect(req.request.method).toBe('GET');
        });

        it('should get games with userId', async () => {
            const promise = service.getGames(123);

            const req = httpMock.expectOne('http://localhost:3000/games?userId=123');

            req.flush(MOCK_GAMES);

            const result = await promise;
            expect(result).toEqual(MOCK_GAMES);
            expect(req.request.method).toBe('GET');
        });

        it('should get single game without userId', async () => {
            const mockGame = MOCK_GAMES[0];

            const promise = service.getGame(mockGame.id);

            const req = httpMock.expectOne(`http://localhost:3000/games/${mockGame.id}`);

            req.flush(mockGame);

            const result = await promise;
            expect(result).toEqual(mockGame);
            expect(req.request.method).toBe('GET');
        });

        it('should get single game with userId', async () => {
            const mockGame = MOCK_GAMES[0];

            const promise = service.getGame(mockGame.id, 123);

            const req = httpMock.expectOne(`http://localhost:3000/games/${mockGame.id}?userId=123`);

            req.flush(mockGame);

            const result = await promise;
            expect(result).toEqual(mockGame);
            expect(req.request.method).toBe('GET');
        });

        it('should get popular games', async () => {
            const promise = service.getPopularGames();

            const req = httpMock.expectOne('http://localhost:3000/games/popular');

            req.flush(MOCK_GAMES);

            const result = await promise;
            expect(result).toEqual(MOCK_GAMES);
            expect(req.request.method).toBe('GET');
        });
    });

    describe('Achievement Methods', () => {
        it('should get achievements by game id without userId', async () => {
            const mockAchievements: Achievement[] = [
                { id: 1, title: 'Achievement 1' } as Achievement,
            ];

            const promise = service.getAchievementsByGameId(123);

            const req = httpMock.expectOne('http://localhost:3000/games/123/achievements');

            req.flush(mockAchievements);

            const result = await promise;
            expect(result).toEqual(mockAchievements);
            expect(req.request.method).toBe('GET');
        });

        it('should get achievements by game id with userId', async () => {
            const mockAchievements: Achievement[] = [
                { id: 1, title: 'Achievement 1' } as Achievement,
            ];

            const promise = service.getAchievementsByGameId(123, 456);

            const req = httpMock.expectOne(
                'http://localhost:3000/games/123/achievements?userId=456',
            );

            req.flush(mockAchievements);

            const result = await promise;
            expect(result).toEqual(mockAchievements);
            expect(req.request.method).toBe('GET');
        });

        it('should complete achievement', async () => {
            const promise = service.completeAchievement(789, 123, 456);

            const req = httpMock.expectOne(
                'http://localhost:3000/games/456/achievements/789/complete?userId=123',
            );

            req.flush({ message: 'Achievement completed' });

            const result = await promise;
            expect(result.message).toBe('Achievement completed');
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual({});
        });

        it('should toggle track game', async () => {
            const promise = service.toggleTrackGame(123, 456, true);

            const req = httpMock.expectOne('http://localhost:3000/games/123/track?userId=456');

            req.flush({ message: 'Track status updated' });

            const result = await promise;
            expect(result.message).toBe('Track status updated');
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual({ isTracked: true });
        });

        it('should get best users by game id', async () => {
            const mockUsers: User[] = [{ id: 1, name: 'User 1', email: 'user1@test.com' }];

            const promise = service.getBestUsersByGameId(123);

            const req = httpMock.expectOne('http://localhost:3000/games/123/best-users');

            req.flush(mockUsers);

            const result = await promise;
            expect(result).toEqual(mockUsers);
            expect(req.request.method).toBe('GET');
        });
    });

    describe('Error Handling', () => {
        it('should handle HTTP error in getGames', async () => {
            const promise = service.getGames();

            const req = httpMock.expectOne('http://localhost:3000/games');

            req.flush('Server Error', {
                status: 500,
                statusText: 'Server Error',
            });

            await expectAsync(promise).toBeRejected();
        });

        it('should handle HTTP error in getGame', async () => {
            const promise = service.getGame(1);

            const req = httpMock.expectOne('http://localhost:3000/games/1');

            req.flush('Not Found', {
                status: 404,
                statusText: 'Not Found',
            });

            await expectAsync(promise).toBeRejected();
        });

        it('should handle HTTP error in completeAchievement', async () => {
            const promise = service.completeAchievement(789, 123, 456);

            const req = httpMock.expectOne(
                'http://localhost:3000/games/456/achievements/789/complete?userId=123',
            );

            req.flush('Unauthorized', {
                status: 401,
                statusText: 'Unauthorized',
            });

            await expectAsync(promise).toBeRejected();
        });

        it('should handle network error', async () => {
            const promise = service.getGames();

            const req = httpMock.expectOne('http://localhost:3000/games');

            req.error(new ErrorEvent('Network Error'));

            await expectAsync(promise).toBeRejected();
        });
    });
});
