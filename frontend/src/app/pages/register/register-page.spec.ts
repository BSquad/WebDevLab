import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { provideRouter, Router } from '@angular/router';

import { RegisterPage } from './register-page';
import { AuthService } from '../../services/auth-service';
import { ToastService } from '../../services/toast-service';
import { AuthServiceMock, RouterMock, ToastServiceMock } from '../../tests/mock-classes.spec';

describe('RegisterPage', () => {
    let component: RegisterPage;
    let fixture: ComponentFixture<RegisterPage>;
    let authService: AuthServiceMock;
    let router: RouterMock;
    let toast: ToastServiceMock;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RegisterPage, FormsModule],
            providers: [
                { provide: AuthService, useClass: AuthServiceMock },
                { provide: ToastService, useClass: ToastServiceMock },
                provideRouter([]),
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(RegisterPage);
        component = fixture.componentInstance;

        authService = TestBed.inject(AuthService) as any;
        router = TestBed.inject(Router) as any;
        toast = TestBed.inject(ToastService) as any;

        spyOn(router, 'navigate');

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should register successfully and navigate to /games', async () => {
        component.username = 'testuser';
        component.email = 'test@example.com';
        component.password = 'password123';

        const form = { valid: true } as NgForm;

        authService.register.and.resolveTo(true);

        await component.onSubmit(form);

        expect(authService.register).toHaveBeenCalledWith({
            name: 'testuser',
            email: 'test@example.com',
            password: 'password123',
        });
        expect(router.navigate).toHaveBeenCalledWith(['/games']);
        expect(toast.showSuccess).toHaveBeenCalledWith('Registration successful!');
        expect(toast.showError).not.toHaveBeenCalled();
    });

    it('should show error toast on registration failure', async () => {
        component.username = 'testuser';
        component.email = 'test@example.com';
        component.password = 'password123';

        const form = { valid: true } as NgForm;

        authService.register.and.resolveTo(false);

        await component.onSubmit(form);

        expect(authService.register).toHaveBeenCalled();
        expect(router.navigate).not.toHaveBeenCalled();
        expect(toast.showError).toHaveBeenCalledWith('Registration failed.');
    });

    it('should not submit when form is invalid', async () => {
        const form = { valid: false } as NgForm;

        await component.onSubmit(form);

        expect(authService.register).not.toHaveBeenCalled();
        expect(router.navigate).not.toHaveBeenCalled();
        expect(toast.showError).not.toHaveBeenCalled();
        expect(toast.showSuccess).not.toHaveBeenCalled();
    });

    it('should show error toast on registration exception', async () => {
        component.username = 'testuser';
        component.email = 'test@example.com';
        component.password = 'password123';

        const form = { valid: true } as NgForm;

        authService.register.and.rejectWith(new Error('Network down'));

        await component.onSubmit(form);

        expect(toast.showError).toHaveBeenCalledWith('Registration error: Network down');
        expect(router.navigate).not.toHaveBeenCalled();
    });
});
