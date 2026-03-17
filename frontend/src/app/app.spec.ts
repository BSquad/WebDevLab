import { TestBed, ComponentFixture } from '@angular/core/testing';
import { App } from './app';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth-service';
import { Subject } from 'rxjs';

describe('App', () => {
    let fixture: ComponentFixture<App>;
    let component: App;

    let routerEvents$: Subject<any>;
    let routerMock: any;
    let authServiceMock: any;

    beforeEach(async () => {
        routerEvents$ = new Subject();

        routerMock = {
            navigate: jasmine.createSpy('navigate'),
            events: routerEvents$,
        };

        authServiceMock = {
            currentUser$: new Subject(),
            logout: jasmine.createSpy('logout'),
        };

        await TestBed.configureTestingModule({
            imports: [App],
            providers: [
                { provide: Router, useValue: routerMock },
                { provide: AuthService, useValue: authServiceMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(App);
        component = fixture.componentInstance;
    });

    it('should create the app', () => {
        expect(component).toBeTruthy();
    });

    it('should show LOGIN button when no user is logged in', () => {
        spyOn(component, 'user').and.returnValue(null);

        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.textContent).toContain('LOGIN');
    });

    it('should show username when user exists', () => {
        spyOn(component, 'user').and.returnValue({
            name: 'TestUser',
            email: 'test@mail.com',
        });

        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.textContent).toContain('TestUser');
    });

    it('should disable MY PAGE button when no user', () => {
        spyOn(component, 'user').and.returnValue(null);

        fixture.detectChanges();

        const buttons = fixture.nativeElement.querySelectorAll(
            'button',
        ) as NodeListOf<HTMLButtonElement>;

        const myPageButton = Array.from(buttons).find((b) => b.textContent?.includes('MY PAGE'))!;

        expect(myPageButton.disabled).toBeTrue();
    });

    it('should enable MY PAGE button when user exists', () => {
        spyOn(component, 'user').and.returnValue({
            name: 'TestUser',
            email: 'test@mail.com',
        });

        fixture.detectChanges();

        const buttons = fixture.nativeElement.querySelectorAll(
            'button',
        ) as NodeListOf<HTMLButtonElement>;

        const myPageButton = Array.from(buttons).find((b) => b.textContent?.includes('MY PAGE'))!;

        expect(myPageButton.disabled).toBeFalse();
    });

    it('should call goToGameList when clicking BROWSE', () => {
        spyOn(component, 'goToGameList');
        spyOn(component, 'user').and.returnValue(null);

        fixture.detectChanges();

        const buttons = fixture.nativeElement.querySelectorAll(
            'button',
        ) as NodeListOf<HTMLButtonElement>;

        const browseButton = Array.from(buttons).find((b) => b.textContent?.includes('BROWSE'))!;

        browseButton.click();

        expect(component.goToGameList).toHaveBeenCalled();
    });

    it('should call goToGameList when clicking brand', () => {
        spyOn(component, 'goToGameList');
        spyOn(component, 'user').and.returnValue(null);

        fixture.detectChanges();

        const brand = fixture.nativeElement.querySelector('.brand');
        brand.click();

        expect(component.goToGameList).toHaveBeenCalled();
    });

    it('should call goToLogin when clicking LOGIN', () => {
        spyOn(component, 'goToLogin');
        spyOn(component, 'user').and.returnValue(null);

        fixture.detectChanges();

        const buttons = fixture.nativeElement.querySelectorAll(
            'button',
        ) as NodeListOf<HTMLButtonElement>;

        const loginButton = Array.from(buttons).find((b) => b.textContent?.includes('LOGIN'))!;

        loginButton.click();

        expect(component.goToLogin).toHaveBeenCalled();
    });

    it('should call goToUserPage when clicking MY PAGE', () => {
        spyOn(component, 'goToUserPage');
        spyOn(component, 'user').and.returnValue({
            name: 'TestUser',
            email: 'test@mail.com',
        });

        fixture.detectChanges();

        const buttons = fixture.nativeElement.querySelectorAll(
            'button',
        ) as NodeListOf<HTMLButtonElement>;

        const myPageButton = Array.from(buttons).find((b) => b.textContent?.includes('MY PAGE'))!;

        myPageButton.click();

        expect(component.goToUserPage).toHaveBeenCalled();
    });

    it('should logout and navigate to login', () => {
        component.logout();

        expect(authServiceMock.logout).toHaveBeenCalled();
        expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    });
});
