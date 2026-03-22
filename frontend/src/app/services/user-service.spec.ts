import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { UserApi } from '../api/user-api';

describe('UserService', () => {
    let service: UserService;
    let userApiSpy: jasmine.SpyObj<UserApi>;

    beforeEach(() => {
        const spy = jasmine.createSpyObj('UserApi', [
            'getUserProfile',
            'getUserSummary',
            'updateUser',
            'updateLayout',
            'getGames',
            'getAchievements',
            'getGuides',
            'startUserAnalysis',
        ]);

        TestBed.configureTestingModule({
            providers: [{ provide: UserApi, useValue: spy }],
        });
        service = TestBed.inject(UserService);
        userApiSpy = TestBed.inject(UserApi) as jasmine.SpyObj<UserApi>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should delegate getUserProfile to UserApi', async () => {
        const mockProfile = { id: 1, name: 'Test' } as any;
        userApiSpy.getUserProfile.and.resolveTo(mockProfile);
        const result = await service.getUserProfile(1);
        expect(userApiSpy.getUserProfile).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockProfile);
    });

    it('should delegate getUserSummary to UserApi', async () => {
        userApiSpy.getUserSummary.and.resolveTo({} as any);
        await service.getUserSummary(1);
        expect(userApiSpy.getUserSummary).toHaveBeenCalledWith(1);
    });

    it('should delegate updateUser to UserApi', async () => {
        const formData = new FormData();
        userApiSpy.updateUser.and.resolveTo();
        await service.updateUser(1, formData);
        expect(userApiSpy.updateUser).toHaveBeenCalledWith(1, formData);
    });

    it('should delegate updateLayout to UserApi', async () => {
        const layout = ['games', 'guides'];
        userApiSpy.updateLayout.and.resolveTo();
        await service.updateLayout(1, layout);
        expect(userApiSpy.updateLayout).toHaveBeenCalledWith(1, layout);
    });

    it('should delegate getGames, getAchievements, and getGuides to UserApi', async () => {
        userApiSpy.getGames.and.resolveTo([]);
        userApiSpy.getAchievements.and.resolveTo([]);
        userApiSpy.getGuides.and.resolveTo([]);

        await service.getGames(1);
        await service.getAchievements(1);
        await service.getGuides(1);

        expect(userApiSpy.getGames).toHaveBeenCalledWith(1);
        expect(userApiSpy.getAchievements).toHaveBeenCalledWith(1);
        expect(userApiSpy.getGuides).toHaveBeenCalledWith(1);
    });

    it('should parse the remaining buffer if stream ends without a newline', async () => {
        const encoder = new TextEncoder();
        const mockAnalysisData = {
            gameCount: 5,
            completionRate: 50,
            mostPlayedGenre: 'FPS',
            achievementCount: 10,
            completedGameCount: 1,
            createdGuidesCount: 0,
        };

        const mockStream = new ReadableStream({
            start(controller) {
                controller.enqueue(encoder.encode('100\n'));
                controller.enqueue(encoder.encode(JSON.stringify(mockAnalysisData)));
                controller.close();
            },
        });

        userApiSpy.startUserAnalysis.and.resolveTo({ body: mockStream } as unknown as Response);

        const result = await service.startUserAnalysis(1);
        expect(result).toEqual(mockAnalysisData);
    });

    it('should throw an error if stream closes without returning JSON data', async () => {
        const encoder = new TextEncoder();

        const mockStream = new ReadableStream({
            start(controller) {
                controller.enqueue(encoder.encode('10\n'));
                controller.enqueue(encoder.encode('20\n'));
                controller.close();
            },
        });

        userApiSpy.startUserAnalysis.and.resolveTo({ body: mockStream } as unknown as Response);

        await expectAsync(service.startUserAnalysis(1)).toBeRejectedWithError(
            'No analysis data received',
        );
    });

    it('should process analysis stream and trigger progress callbacks', async () => {
        const encoder = new TextEncoder();

        const mockAnalysisData = {
            gameCount: 10,
            completionRate: 85,
            mostPlayedGenre: 'RPG',
            achievementCount: 20,
            completedGameCount: 2,
            createdGuidesCount: 1,
        };

        const mockStream = new ReadableStream({
            start(controller) {
                controller.enqueue(encoder.encode('50\n'));
                controller.enqueue(encoder.encode(JSON.stringify(mockAnalysisData)));
                controller.close();
            },
        });

        const mockResponse = { body: mockStream } as unknown as Response;
        userApiSpy.startUserAnalysis.and.resolveTo(mockResponse);

        const progressSpy = jasmine.createSpy('onProgress');
        const result = await service.startUserAnalysis(1, progressSpy);

        expect(progressSpy).toHaveBeenCalledWith(50);
        expect(result).toEqual(mockAnalysisData);
    });
});
