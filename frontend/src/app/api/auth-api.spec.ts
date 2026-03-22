import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthApi } from './auth-api';
import { User } from '../../../../shared/models/user';
import { RegisterData } from '../../../../shared/models/register-data';

describe('AuthApi', () => {
    let service: AuthApi;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AuthApi],
        });
        service = TestBed.inject(AuthApi);
        httpMock = TestBed.inject(HttpTestingController);

        (service as any).apiUrl = 'http://localhost:3000';
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('Auth Methods', () => {
        it('should login successfully', async () => {
            const mockUser: User = {
                id: 1,
                name: 'testuser',
                email: 'test@example.com',
            } as User;

            const promise = service.login('testuser', 'password123');

            const req = httpMock.expectOne('http://localhost:3000/auth/login');

            req.flush(mockUser);

            const result = await promise;
            expect(result).toEqual(mockUser);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual({ name: 'testuser', password: 'password123' });
        });

        it('should register successfully', async () => {
            const registerData: RegisterData = {
                name: 'newuser',
                email: 'new@example.com',
                password: 'password123',
            } as RegisterData;

            const promise = service.register(registerData);

            const req = httpMock.expectOne('http://localhost:3000/auth/register');

            req.flush({ message: 'User registered successfully' });

            const result = await promise;
            expect(result).toBe(true);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(registerData);
        });
    });
});
