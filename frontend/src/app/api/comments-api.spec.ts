import { TestBed } from '@angular/core/testing';
import { CommentsApi } from './comments-api';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GuideComment } from '../../../../shared/models/guide-comment';

describe('CommentsApi', () => {
    let service: CommentsApi;
    let httpMock: HttpTestingController;

    const mockComment: GuideComment = {
        id: 1,
        guideId: 1,
        userId: 1,
        commentText: 'Test Comment',
        createdAt: new Date().toISOString(),
        author: 'Tester',
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [CommentsApi],
        });

        service = TestBed.inject(CommentsApi);
        httpMock = TestBed.inject(HttpTestingController);

        (service as any).apiUrl = 'http://localhost:3000';
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get comments by guideId', async () => {
        const promise = service.getComments(1);

        const req = httpMock.expectOne('http://localhost:3000/comments/1');
        expect(req.request.method).toBe('GET');

        req.flush([mockComment]);

        const result = await promise;
        expect(result.length).toBe(1);
        expect(result[0].commentText).toBe('Test Comment');
    });

    it('should create a comment', async () => {
        const promise = service.createComment(mockComment);

        const req = httpMock.expectOne('http://localhost:3000/comments');
        expect(req.request.method).toBe('POST');
        expect(req.request.body.commentText).toBe('Test Comment');

        req.flush(true);

        const result = await promise;
        expect(result).toBeTrue();
    });

    it('should handle error when creating comment', async () => {
        const promise = service.createComment(mockComment);

        const req = httpMock.expectOne('http://localhost:3000/comments');

        req.flush('Error', { status: 500, statusText: 'Server Error' });

        await expectAsync(promise).toBeRejected();
    });
});
