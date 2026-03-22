import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UserTooltip } from './user-tooltip';
import { UserService } from '../../services/user.service';
import { UserSummary } from '../../../../../shared/models/user';
import { By } from '@angular/platform-browser';

describe('UserTooltip', () => {
    let component: UserTooltip;
    let fixture: ComponentFixture<UserTooltip>;
    let userServiceSpy: jasmine.SpyObj<UserService>;

    const mockUser: UserSummary = {
        id: 1,
        name: 'Test User',
        profilePicturePath: '/images/test.jpg',
    } as UserSummary;

    beforeEach(async () => {
        userServiceSpy = jasmine.createSpyObj<UserService>('UserService', ['getUserSummary']);

        await TestBed.configureTestingModule({
            imports: [UserTooltip],
            providers: [{ provide: UserService, useValue: userServiceSpy }],
        }).compileComponents();

        fixture = TestBed.createComponent(UserTooltip);
        component = fixture.componentInstance;
        component.userId = 1;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set isHovering to true and load userSummary after hover delay', async () => {
        userServiceSpy.getUserSummary.and.returnValue(Promise.resolve(mockUser));

        jasmine.clock().install();

        component.onMouseEnter();

        jasmine.clock().tick(500);

        await Promise.resolve();

        expect(component.isHovering()).toBeTrue();
        expect(userServiceSpy.getUserSummary).toHaveBeenCalledWith(1);
        expect(component.userSummary()).toEqual(mockUser);
        expect(component.isLoading()).toBeFalse();

        jasmine.clock().uninstall();
    });

    it('should cancel hover on mouse leave before timeout', async () => {
        component.onMouseEnter();

        jasmine.clock().install();
        jasmine.clock().tick(200);
        component.onMouseLeave();
        jasmine.clock().tick(300);
        jasmine.clock().uninstall();

        expect(component.isHovering()).toBeFalse();
        expect(userServiceSpy.getUserSummary).not.toHaveBeenCalled();
    });

    it('getProfileImageUrl should return default when path is null/undefined', () => {
        expect(component.getProfileImageUrl(null)).toBe(component.defaultImagePath);
        expect(component.getProfileImageUrl(undefined)).toBe(component.defaultImagePath);
    });

    it('should show spinner when hovering and loading', async () => {
        jasmine.clock().install();
        userServiceSpy.getUserSummary.and.returnValue(new Promise(() => {})); // hängt

        component.onMouseEnter();
        jasmine.clock().tick(500);
        fixture.detectChanges();

        const spinner = fixture.debugElement.query(By.css('mat-spinner'));
        expect(spinner).toBeTruthy();

        jasmine.clock().uninstall();
    });

    it('should show user summary when loaded', async () => {
        jasmine.clock().install();
        userServiceSpy.getUserSummary.and.returnValue(Promise.resolve(mockUser));

        component.onMouseEnter();
        jasmine.clock().tick(500);
        await Promise.resolve();
        fixture.detectChanges();

        const avatar = fixture.debugElement.query(By.css('.avatar'));
        const name = fixture.debugElement.query(By.css('h4'));
        expect(avatar).toBeTruthy();
        expect(name.nativeElement.textContent).toContain('Test User');

        jasmine.clock().uninstall();
    });
});
