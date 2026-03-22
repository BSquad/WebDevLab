import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { UserApi } from './user-api';
import { ToastService } from '../services/toast-service';
import { MOCK_GAMES } from '../tests/mock-data.spec';
import { ToastServiceMock } from '../tests/mock-classes.spec';

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

    it('should get games', async () => {
        const userId = 1;
        const promise = service.getGames(userId);

        const req = httpMock.expectOne(`${service['apiUrl']}/users/${userId}/games`);
        expect(req.request.method).toBe('GET');
        req.flush(MOCK_GAMES);

        const games = await promise;
        expect(games).toEqual(MOCK_GAMES);
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
        // Mock global fetch for this specific test
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
