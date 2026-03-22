import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { Location } from '@angular/common';

import { GuideEditorPage } from './guide-editor-page';
import { GuideService } from '../../services/guide-service';
import { GameService } from '../../services/game-service';
import { ToastService } from '../../services/toast-service';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';

describe('GuideEditorPage', () => {
    let component: GuideEditorPage;
    let fixture: ComponentFixture<GuideEditorPage>;

    let guideServiceSpy: any;
    let gameServiceSpy: any;
    let toastServiceSpy: any;
    let authServiceSpy: any;
    let locationSpy: any;
    let activatedRouteMock: any;
    let routerSpy: any;

    const mockGuide = {
        title: 'Test title',
        content: 'Test content',
        gameId: 1,
        userId: 1,
    };

    function createForm(valid: boolean, controls = {}) {
        return { valid, controls } as any;
    }

    beforeEach(async () => {
        guideServiceSpy = jasmine.createSpyObj('GuideService', [
            'getGuideById',
            'saveGuideWithScreenshots',
        ]);

        gameServiceSpy = jasmine.createSpyObj('GameService', ['getGame']);
        toastServiceSpy = jasmine.createSpyObj('ToastService', ['showError', 'showSuccess']);
        authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
        locationSpy = jasmine.createSpyObj('Location', ['back']);
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        authServiceSpy.getCurrentUser.and.returnValue({ id: 1 });

        activatedRouteMock = {
            snapshot: {
                paramMap: {
                    get: () => null,
                },
            },
        };

        await TestBed.configureTestingModule({
            imports: [GuideEditorPage, FormsModule],
            providers: [
                { provide: ActivatedRoute, useValue: activatedRouteMock },
                { provide: GuideService, useValue: guideServiceSpy },
                { provide: GameService, useValue: gameServiceSpy },
                { provide: ToastService, useValue: toastServiceSpy },
                { provide: AuthService, useValue: authServiceSpy },
                { provide: Location, useValue: locationSpy },
                { provide: Router, useValue: routerSpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GuideEditorPage);
        component = fixture.componentInstance;

        component.guide = { ...mockGuide };
    });

    it('should create', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    describe('initialization', () => {
        it('should init in create mode', async () => {
            gameServiceSpy.getGame.and.resolveTo({ id: 1 });

            await component.ngOnInit();

            expect(component.isEditMode).toBeFalse();
        });

        it('should init in edit mode', async () => {
            activatedRouteMock.snapshot.paramMap.get = (key: string) =>
                key === 'guideId' ? '1' : null;

            guideServiceSpy.getGuideById.and.resolveTo({ id: 1, gameId: 1, userId: 1 });
            gameServiceSpy.getGame.and.resolveTo({ id: 1 });

            await component.ngOnInit();

            expect(component.isEditMode).toBeTrue();
        });

        it('should block editing if not owner', async () => {
            activatedRouteMock.snapshot.paramMap.get = () => '1';

            guideServiceSpy.getGuideById.and.resolveTo({
                id: 1,
                gameId: 1,
                userId: 999,
            });

            await component.ngOnInit();

            expect(toastServiceSpy.showError).toHaveBeenCalled();
        });
    });

    describe('file handling', () => {
        it('should add files', () => {
            const file = new File(['data'], 'test.png');

            spyOn(URL, 'createObjectURL').and.returnValue('blob:test');

            component.onFileSelected({
                target: { files: [file] },
            } as any);

            expect(component.previewUrls.length).toBe(1);
        });

        it('should remove blob file', () => {
            component.previewUrls = ['blob:test'];
            component.selectedFiles = [new File(['data'], 'test.png')];

            component.removeScreenshot(0);

            expect(component.previewUrls.length).toBe(0);
        });

        it('should mark existing screenshot as deleted', () => {
            component.previewUrls = ['http://localhost:3000/test.png'];

            component.removeScreenshot(0);

            expect(component.deletedScreenshots.length).toBe(1);
        });
    });

    describe('submit', () => {
        it('should not submit invalid form', async () => {
            const form = createForm(false, {
                title: { invalid: true },
                content: { invalid: true },
            });

            await component.onSubmit(form);

            expect(guideServiceSpy.saveGuideWithScreenshots).not.toHaveBeenCalled();
        });

        it('should show validation errors in toast', async () => {
            const form = createForm(false, {
                title: { invalid: true },
                content: { invalid: true },
            });

            await component.onSubmit(form);

            expect(toastServiceSpy.showError).toHaveBeenCalledWith(
                'Title is required | Content is required',
            );
        });

        it('should create guide successfully', async () => {
            guideServiceSpy.saveGuideWithScreenshots.and.resolveTo(1);

            component.gameId = 1;
            component.userId = 1;
            component.isEditMode = false;

            await component.onSubmit(createForm(true));

            expect(guideServiceSpy.saveGuideWithScreenshots).toHaveBeenCalledWith(
                component.guide,
                jasmine.objectContaining({
                    isEditMode: false,
                    userId: 1,
                }),
            );

            expect(routerSpy.navigate).toHaveBeenCalledWith(['/games', 1]);

            expect(toastServiceSpy.showSuccess).toHaveBeenCalledWith('Guide created successfully!');
        });

        it('should update guide successfully', async () => {
            guideServiceSpy.saveGuideWithScreenshots.and.resolveTo(1);

            component.isEditMode = true;
            component.guideId = 1;
            component.userId = 1;
            component.gameId = 1;

            await component.onSubmit(createForm(true));

            expect(guideServiceSpy.saveGuideWithScreenshots).toHaveBeenCalledWith(
                component.guide,
                jasmine.objectContaining({
                    isEditMode: true,
                    guideId: 1,
                    userId: 1,
                }),
            );

            expect(routerSpy.navigate).toHaveBeenCalledWith(['/games', 1]);

            expect(toastServiceSpy.showSuccess).toHaveBeenCalledWith('Guide updated successfully!');
        });

        it('should handle error on save', async () => {
            guideServiceSpy.saveGuideWithScreenshots.and.rejectWith(new Error());

            component.gameId = 1;
            component.userId = 1;

            await component.onSubmit(createForm(true));

            expect(toastServiceSpy.showError).toHaveBeenCalled();
        });
    });

    describe('template interactions', () => {
        it('should call goBack on button click', () => {
            spyOn(component, 'goBack');

            fixture.detectChanges();

            fixture.nativeElement.querySelector('.back-button').click();

            expect(component.goBack).toHaveBeenCalled();
        });

        it('should call onSubmit from form', () => {
            spyOn(component, 'onSubmit');

            fixture.detectChanges();

            fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));

            expect(component.onSubmit).toHaveBeenCalled();
        });

        it('should call onFileSelected on file change', () => {
            spyOn(component, 'onFileSelected');

            fixture.detectChanges();

            const input = fixture.nativeElement.querySelector('#screenshots');
            input.dispatchEvent(new Event('change'));

            expect(component.onFileSelected).toHaveBeenCalled();
        });

        it('should render preview images', () => {
            component.previewUrls = ['a.png'];

            fixture.detectChanges();

            expect(fixture.nativeElement.querySelectorAll('.preview-image').length).toBe(1);
        });

        it('should call removeScreenshot on click', () => {
            component.previewUrls = ['test.png'];
            spyOn(component, 'removeScreenshot');

            fixture.detectChanges();

            fixture.nativeElement.querySelector('.remove-preview').click();

            expect(component.removeScreenshot).toHaveBeenCalledWith(0);
        });

        it('should call openImage when image clicked', () => {
            component.previewUrls = ['test.png'];
            spyOn(component, 'openImage');

            fixture.detectChanges();

            fixture.nativeElement.querySelector('.preview-image').click();

            expect(component.openImage).toHaveBeenCalledWith('test.png');
        });

        it('should show delete button and call deleteGuide', () => {
            component.isEditMode = true;
            spyOn(component, 'deleteGuide');

            fixture.detectChanges();

            fixture.nativeElement.querySelector('.delete-button').click();

            expect(component.deleteGuide).toHaveBeenCalled();
        });

        it('should show create title', () => {
            component.isEditMode = false;
            component.game.set({ id: 1, title: 'Test Game' } as any);

            fixture.detectChanges();

            expect(fixture.nativeElement.textContent).toContain('Create Guide');
        });

        it('should show edit title', () => {
            component.isEditMode = true;

            fixture.detectChanges();

            expect(fixture.nativeElement.textContent).toContain('Edit Guide');
        });

        it('should open and close image overlay', () => {
            component.activeImage.set('test.png');
            spyOn(component, 'closeImage');

            fixture.detectChanges();

            fixture.nativeElement.querySelector('.image-overlay').click();

            expect(component.closeImage).toHaveBeenCalled();
        });

        it('should trigger file input click when upload button is clicked', () => {
            fixture.detectChanges();

            const input = fixture.nativeElement.querySelector('#screenshots');
            spyOn(input, 'click');

            const button = fixture.nativeElement.querySelector('.upload-button');
            button.click();

            expect(input.click).toHaveBeenCalled();
        });
    });

    it('should go back', () => {
        component.goBack();
        expect(locationSpy.back).toHaveBeenCalled();
    });
});
