import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginPage } from './login-page';
import { AuthService } from '../../services/auth-service';
import { ToastService } from '../../services/toast-service';

class AuthServiceMock {
    loginWithCredentials = jasmine.createSpy('loginWithCredentials').and.resolveTo(true);
}

class RouterMock {
    navigate = jasmine.createSpy('navigate');
}

class ToastServiceMock {
    showSuccess = jasmine.createSpy('showSuccess');
    showError = jasmine.createSpy('showError');
}

describe('LoginPage', () => {
    let component: LoginPage;
    let fixture: ComponentFixture<LoginPage>;
    let authService: AuthServiceMock;
    let router: RouterMock;
    let toast: ToastServiceMock;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoginPage, FormsModule],
            providers: [
                { provide: AuthService, useClass: AuthServiceMock },
                { provide: Router, useClass: RouterMock },
                { provide: ToastService, useClass: ToastServiceMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(LoginPage);
        component = fixture.componentInstance;

        authService = TestBed.inject(AuthService) as any;
        router = TestBed.inject(Router) as any;
        toast = TestBed.inject(ToastService) as any;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should login successfully and navigate to /games', async () => {
        component.username = 'testuser';
        component.password = 'password';

        const form = { valid: true } as NgForm;

        authService.loginWithCredentials.and.resolveTo(true);

        await component.onSubmit(form);

        expect(authService.loginWithCredentials).toHaveBeenCalledWith('testuser', 'password');
        expect(router.navigate).toHaveBeenCalledWith(['/games']);
        expect(toast.showSuccess).toHaveBeenCalledWith('Login successful!');
        expect(toast.showError).not.toHaveBeenCalled();
    });

    it('should show error toast on invalid credentials', async () => {
        component.username = 'wrong';
        component.password = 'wrong';

        const form = { valid: true } as NgForm;

        authService.loginWithCredentials.and.resolveTo(false);

        await component.onSubmit(form);

        expect(authService.loginWithCredentials).toHaveBeenCalled();
        expect(router.navigate).not.toHaveBeenCalled();
        expect(toast.showError).toHaveBeenCalledWith('Incorrect username or password.');
    });

    it('should not submit when form is invalid', async () => {
        const form = { valid: false } as NgForm;

        await component.onSubmit(form);

        expect(authService.loginWithCredentials).not.toHaveBeenCalled();
        expect(router.navigate).not.toHaveBeenCalled();
        expect(toast.showError).not.toHaveBeenCalled();
        expect(toast.showSuccess).not.toHaveBeenCalled();
    });

    it('should show error toast on login exception', async () => {
        component.username = 'test';
        component.password = 'test';

        const form = { valid: true } as NgForm;

        authService.loginWithCredentials.and.rejectWith(new Error('Network down'));

        await component.onSubmit(form);

        expect(toast.showError).toHaveBeenCalledWith('Login error: Network down');
        expect(router.navigate).not.toHaveBeenCalled();
    });
});
