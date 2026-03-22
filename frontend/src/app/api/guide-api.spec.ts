import { TestBed } from '@angular/core/testing';
import { GuideApi } from './guide-api';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Guide } from '../../../../shared/models/guide';

describe('GuideApi', () => {
    let service: GuideApi;
    let httpMock: HttpTestingController;

    const mockGuide: Guide = {
        id: 1,
        title: 'Test Guide',
        content: 'Test Content',
        gameId: 1,
        userId: 1,
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [GuideApi],
        });

        service = TestBed.inject(GuideApi);
        httpMock = TestBed.inject(HttpTestingController);

        (service as any).apiUrl = 'http://localhost:3000';
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get guides by gameId', async () => {
        const promise = service.getGuidesByGameId(1);

        const req = httpMock.expectOne('http://localhost:3000/guides/game/1');
        expect(req.request.method).toBe('GET');

        req.flush([mockGuide]);

        const result = await promise;
        expect(result.length).toBe(1);
        expect(result[0].title).toBe('Test Guide');
    });

    it('should get guide by id', async () => {
        const promise = service.getGuideById(1);

        const req = httpMock.expectOne('http://localhost:3000/guides/1');
        expect(req.request.method).toBe('GET');

        req.flush(mockGuide);

        const result = await promise;
        expect(result.id).toBe(1);
    });

    it('should create a guide', async () => {
        const promise = service.createGuide(mockGuide);

        const req = httpMock.expectOne('http://localhost:3000/guides');
        expect(req.request.method).toBe('POST');
        expect(req.request.body.title).toBe('Test Guide');

        req.flush({ id: 123 });

        const result = await promise;
        expect(result.id).toBe(123);
    });

    it('should update a guide', async () => {
        const promise = service.updateGuide(1, mockGuide, 1);

        const req = httpMock.expectOne('http://localhost:3000/guides/1');
        expect(req.request.method).toBe('PUT');
        expect(req.request.body.userId).toBe(1);

        req.flush({ message: 'Guide updated successfully' });

        const result = await promise;
        expect(result.message).toBeDefined();
    });

    it('should delete a guide', async () => {
        const promise = service.deleteGuide(1, 1);

        const req = httpMock.expectOne('http://localhost:3000/guides/1');
        expect(req.request.method).toBe('DELETE');
        expect(req.request.body.userId).toBe(1);

        req.flush({ message: 'Guide deleted successfully' });

        const result = await promise;
        expect(result.message).toBeDefined();
    });

    it('should rate a guide', async () => {
        const promise = service.rateGuide(1, 5, 1);

        const req = httpMock.expectOne('http://localhost:3000/guides/1/rate');
        expect(req.request.method).toBe('POST');
        expect(req.request.body.rating).toBe(5);

        req.flush({ message: 'Rating submitted' });

        const result = await promise;
        expect(result.message).toBeDefined();
    });

    it('should get top guides', async () => {
        const promise = service.getTopGuides(1);

        const req = httpMock.expectOne('http://localhost:3000/guides/top/1');
        expect(req.request.method).toBe('GET');

        req.flush([mockGuide]);

        const result = await promise;
        expect(result.length).toBe(1);
    });

    it('should upload screenshot', async () => {
        const mockFile = new File(['test'], 'screenshot.png', { type: 'image/png' });
        const promise = service.uploadScreenshot(1, mockFile);

        const req = httpMock.expectOne('http://localhost:3000/guides/1/upload');
        expect(req.request.method).toBe('POST');

        // Check FormData content
        const formData = req.request.body as FormData;
        expect(formData.get('uploadType')).toBe('guides');
        expect(formData.get('image')).toBe(mockFile);

        req.flush({ path: '/uploads/guides/screenshot.png' });

        const result = await promise;
        expect(result.path).toBe('/uploads/guides/screenshot.png');
    });

    it('should delete screenshot', async () => {
        const filePath = '/uploads/guides/screenshot.png';
        const promise = service.deleteScreenshot(1, filePath);

        const req = httpMock.expectOne('http://localhost:3000/guides/1/screenshot');
        expect(req.request.method).toBe('DELETE');
        expect(req.request.body).toEqual({ filePath });

        req.flush({ message: 'Screenshot deleted successfully' });

        const result = await promise;
        expect(result.message).toBe('Screenshot deleted successfully');
    });

    it('should download pdf', async () => {
        const mockBlob = new Blob(['test pdf content'], { type: 'application/pdf' });
        const promise = service.downloadPdf(1);

        const req = httpMock.expectOne('http://localhost:3000/guides/1/pdf');
        expect(req.request.method).toBe('GET');
        expect(req.request.responseType).toBe('blob');

        req.flush(mockBlob);

        const result = await promise;
        expect(result).toBeInstanceOf(Blob);
        expect(result.type).toBe('application/pdf');
    });
});
