import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { BaseApi } from './base-api';
import { of, throwError } from 'rxjs';

describe('BaseApi', () => {
    let service: BaseApi;
    let httpMock: HttpTestingController;
    let httpClient: any;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [BaseApi],
        });
        service = TestBed.inject(BaseApi);
        httpMock = TestBed.inject(HttpTestingController);
        httpClient = TestBed.inject(HttpClient);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
        expect(service['apiUrl']).toBe('http://localhost:3000');
    });

    describe('request method', () => {
        it('should handle successful request', async () => {
            const mockData = { id: 1, name: 'Test' };

            const promise = service['request'](of(mockData));
            const result = await promise;

            expect(result).toEqual(mockData);
        });

        it('should handle error without error property', async () => {
            const plainError = new Error('Plain error');

            const promise = service['request'](throwError(() => plainError));

            await expectAsync(promise).toBeRejectedWith(plainError);
        });
    });
});
