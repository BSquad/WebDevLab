import { TestBed } from '@angular/core/testing';
import { GuideService } from './guide-service';
import { GuideApi } from '../api/guide-api';
import { Guide } from '../../../../shared/models/guide';

describe('GuideService', () => {
    let service: GuideService;
    let guideApiSpy: any;

    const mockGuide: Guide = {
        id: 1,
        title: 'Test',
        content: 'Content',
        gameId: 1,
        userId: 1,
    };

    beforeEach(() => {
        guideApiSpy = jasmine.createSpyObj('GuideApi', [
            'createGuide',
            'updateGuide',
            'deleteGuide',
            'uploadScreenshot',
            'deleteScreenshot',
            'rateGuide',
            'getGuideById',
            'getGuidesByGameId',
            'getTopGuides',
            'downloadPdf',
        ]);

        TestBed.configureTestingModule({
            providers: [GuideService, { provide: GuideApi, useValue: guideApiSpy }],
        });

        service = TestBed.inject(GuideService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get guides by game id', async () => {
        guideApiSpy.getGuidesByGameId.and.resolveTo([mockGuide]);

        const result = await service.getGuidesByGameId(1);

        expect(guideApiSpy.getGuidesByGameId).toHaveBeenCalledWith(1);
        expect(result).toEqual([mockGuide]);
    });

    it('should get guide by id', async () => {
        guideApiSpy.getGuideById.and.resolveTo(mockGuide);

        const result = await service.getGuideById(1);

        expect(guideApiSpy.getGuideById).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockGuide);
    });

    it('should get top guides', async () => {
        guideApiSpy.getTopGuides.and.resolveTo([mockGuide]);

        const result = await service.getTopGuides(1);

        expect(guideApiSpy.getTopGuides).toHaveBeenCalledWith(1);
        expect(result).toEqual([mockGuide]);
    });

    it('should create guide', async () => {
        guideApiSpy.createGuide.and.resolveTo({ id: 123 });

        const result = await service.createGuide(mockGuide);

        expect(guideApiSpy.createGuide).toHaveBeenCalledWith(mockGuide);
        expect(result).toBe(123);
    });

    it('should update guide', async () => {
        guideApiSpy.updateGuide.and.resolveTo({ message: 'ok' });

        await service.updateGuide(1, mockGuide, 1);

        expect(guideApiSpy.updateGuide).toHaveBeenCalledWith(1, mockGuide, 1);
    });

    it('should delete guide', async () => {
        guideApiSpy.deleteGuide.and.resolveTo({ message: 'ok' });

        await service.deleteGuide(1, 1);

        expect(guideApiSpy.deleteGuide).toHaveBeenCalledWith(1, 1);
    });

    it('should rate guide', async () => {
        guideApiSpy.rateGuide.and.resolveTo({ message: 'ok' });

        await service.rateGuide(1, 5, 1);

        expect(guideApiSpy.rateGuide).toHaveBeenCalledWith(1, 5, 1);
    });

    it('should upload screenshot', async () => {
        const file = new File(['data'], 'test.png');
        guideApiSpy.uploadScreenshot.and.resolveTo({ path: '/img.png' });

        const result = await service.uploadScreenshot(1, file);

        expect(guideApiSpy.uploadScreenshot).toHaveBeenCalledWith(1, file);
        expect(result).toBe('/img.png');
    });

    it('should delete screenshot', async () => {
        guideApiSpy.deleteScreenshot.and.resolveTo({ message: 'ok' });

        await service.deleteScreenshot(1, '/img.png');

        expect(guideApiSpy.deleteScreenshot).toHaveBeenCalledWith(1, '/img.png');
    });

    it('should create guide with screenshots', async () => {
        guideApiSpy.createGuide.and.resolveTo({ id: 1 });
        guideApiSpy.uploadScreenshot.and.resolveTo({ path: '/img.png' });

        const result = await service.saveGuideWithScreenshots(mockGuide, {
            isEditMode: false,
            userId: 1,
            newFiles: [new File(['data'], 'a.png')],
            deletedScreenshots: [],
        });

        expect(guideApiSpy.createGuide).toHaveBeenCalled();
        expect(guideApiSpy.uploadScreenshot).toHaveBeenCalled();
        expect(result).toBe(1);
    });

    it('should throw if create fails', async () => {
        guideApiSpy.createGuide.and.resolveTo({ id: null });

        await expectAsync(
            service.saveGuideWithScreenshots(mockGuide, {
                isEditMode: false,
                userId: 1,
                newFiles: [],
                deletedScreenshots: [],
            }),
        ).toBeRejectedWithError('CREATE_FAILED');
    });

    it('should update guide and delete screenshots', async () => {
        guideApiSpy.updateGuide.and.resolveTo({ message: 'ok' });
        guideApiSpy.deleteScreenshot.and.resolveTo({ message: 'ok' });

        const result = await service.saveGuideWithScreenshots(mockGuide, {
            isEditMode: true,
            guideId: 1,
            userId: 1,
            newFiles: [],
            deletedScreenshots: ['/img.png'],
        });

        expect(guideApiSpy.updateGuide).toHaveBeenCalledWith(1, mockGuide, 1);
        expect(guideApiSpy.deleteScreenshot).toHaveBeenCalledWith(1, '/img.png');
        expect(result).toBe(1);
    });

    it('should rollback if upload fails on create', async () => {
        guideApiSpy.createGuide.and.resolveTo({ id: 1 });
        guideApiSpy.uploadScreenshot.and.rejectWith(new Error('fail'));
        guideApiSpy.deleteGuide.and.resolveTo({ message: 'ok' });

        await expectAsync(
            service.saveGuideWithScreenshots(mockGuide, {
                isEditMode: false,
                userId: 1,
                newFiles: [new File(['data'], 'a.png')],
                deletedScreenshots: [],
            }),
        ).toBeRejectedWithError('UPLOAD_FAILED');

        expect(guideApiSpy.deleteGuide).toHaveBeenCalledWith(1, 1);
    });

    it('should NOT rollback on upload fail in edit mode', async () => {
        guideApiSpy.updateGuide.and.resolveTo({ message: 'ok' });
        guideApiSpy.uploadScreenshot.and.rejectWith(new Error('fail'));

        await expectAsync(
            service.saveGuideWithScreenshots(mockGuide, {
                isEditMode: true,
                guideId: 1,
                userId: 1,
                newFiles: [new File(['data'], 'a.png')],
                deletedScreenshots: [],
            }),
        ).toBeRejectedWithError('UPLOAD_FAILED');

        expect(guideApiSpy.deleteGuide).not.toHaveBeenCalled();
    });

    it('should rate and refresh guide', async () => {
        guideApiSpy.rateGuide.and.resolveTo({ message: 'ok' });
        guideApiSpy.getGuideById.and.resolveTo(mockGuide);

        const result = await service.rateGuideAndRefresh(1, 5, 1);

        expect(guideApiSpy.rateGuide).toHaveBeenCalledWith(1, 5, 1);
        expect(guideApiSpy.getGuideById).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockGuide);
    });

    it('should download pdf file', async () => {
        const blob = new Blob(['test'], { type: 'application/pdf' });

        guideApiSpy.downloadPdf.and.resolveTo(blob);

        spyOn(window.URL, 'createObjectURL').and.returnValue('blob:test');
        spyOn(document, 'createElement').and.callThrough();

        await service.downloadPdfFile(1);

        expect(guideApiSpy.downloadPdf).toHaveBeenCalledWith(1);
        expect(window.URL.createObjectURL).toHaveBeenCalled();
    });
});
