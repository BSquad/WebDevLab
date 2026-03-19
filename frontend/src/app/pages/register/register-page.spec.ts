import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { RegisterPage } from './register-page';
import { AuthService } from '../../services/auth-service';
import { ToastService } from '../../services/toast-service';
import { AuthServiceMock, ToastServiceMock } from '../../tests/mock-classes.spec';

describe('RegisterPage', () => {
    let component: RegisterPage;
    let fixture: ComponentFixture<RegisterPage>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RegisterPage, FormsModule],
            providers: [
                provideRouter([]),
                { provide: AuthService, useClass: AuthServiceMock },
                { provide: ToastService, useClass: ToastServiceMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(RegisterPage);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
