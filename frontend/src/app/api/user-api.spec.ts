import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { UserApi } from './user-api';
import { ToastService } from '../services/toast-service';
import { MOCK_GAMES } from '../tests/mock-data.spec';
import { ToastServiceMock } from '../tests/mock-classes.spec';
import { UserProfile, UserSummary } from '../../../../shared/models/user';
import { Achievement } from '../../../../shared/models/achievement';
import { Guide } from '../../../../shared/models/guide';
import { SKIP_LOADING } from '../interceptors/loading.interceptor';

describe('UserApi', () => {
    let service: UserApi;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                { provide: ToastService, useClass: ToastServiceMock },
            ],
        });
        service = TestBed.inject(UserApi);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get user profile', async () => {
        const mockProfile: UserProfile = {
            id: 1,
            name: 'testuser',
            email: 'test@example.com',
        } as UserProfile;

        const promise = service.getUserProfile(1);

        const req = httpMock.expectOne(`${service['apiUrl']}/users/1/profile`);
        expect(req.request.method).toBe('GET');
        req.flush(mockProfile);

        const result = await promise;
        expect(result).toEqual(mockProfile);
    });

    it('should get user summary', async () => {
        const mockSummary: UserSummary = {
            id: 1,
            name: 'testuser',
            profilePicturePath: '/avatar.jpg',
            gamesCount: 5,
            guidesCount: 3,
            achievementsCount: 10,
        } as UserSummary;

        const promise = service.getUserSummary(1);

        const req = httpMock.expectOne(`${service['apiUrl']}/users/1/summary`);
        expect(req.request.method).toBe('GET');
        expect(req.request.context.get(SKIP_LOADING)).toBe(true);
        req.flush(mockSummary);

        const result = await promise;
        expect(result).toEqual(mockSummary);
    });

    it('should update user', async () => {
        const formData = new FormData();
        formData.append('name', 'updateduser');
        formData.append('email', 'updated@example.com');

        const promise = service.updateUser(1, formData);

        const req = httpMock.expectOne(`${service['apiUrl']}/users/1`);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toBe(formData);
        req.flush(null);

        await expectAsync(promise).toBeResolved();
    });

    it('should get games', async () => {
        const userId = 1;
        const promise = service.getGames(userId);

        const req = httpMock.expectOne(`${service['apiUrl']}/users/${userId}/games`);
        expect(req.request.method).toBe('GET');
        req.flush(MOCK_GAMES);

        const games = await promise;
        expect(games).toEqual(MOCK_GAMES);
    });

    it('should get achievements', async () => {
        const mockAchievements: Achievement[] = [{ id: 1, title: 'Achievement 1' } as Achievement];

        const promise = service.getAchievements(1);

        const req = httpMock.expectOne(`${service['apiUrl']}/users/1/achievements`);
        expect(req.request.method).toBe('GET');
        req.flush(mockAchievements);

        const result = await promise;
        expect(result).toEqual(mockAchievements);
    });

    it('should get guides', async () => {
        const mockGuides: Guide[] = [{ id: 1, title: 'Guide 1' } as Guide];

        const promise = service.getGuides(1);

        const req = httpMock.expectOne(`${service['apiUrl']}/users/1/guides`);
        expect(req.request.method).toBe('GET');
        req.flush(mockGuides);

        const result = await promise;
        expect(result).toEqual(mockGuides);
    });

    it('should update layout', async () => {
        const userId = 1;
        const layout = ['games', 'analysis'];
        const promise = service.updateLayout(userId, layout);

        const req = httpMock.expectOne(`${service['apiUrl']}/users/${userId}/layout`);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual({ order: layout });
        req.flush(null);

        await expectAsync(promise).toBeResolved();
    });

    it('should start user analysis using fetch', async () => {
        const mockResponse = new Response(new ReadableStream());
        spyOn(window, 'fetch').and.resolveTo(mockResponse);

        const response = await service.startUserAnalysis(1);

        expect(window.fetch).toHaveBeenCalledWith(
            `${service['apiUrl']}/users/analysis`,
            jasmine.objectContaining({ method: 'POST' }),
        );
        expect(response).toBe(mockResponse);
    });
});
