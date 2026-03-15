import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { Location } from '@angular/common';

import { GuideEditorPage } from './guide-editor-page';
import { GuideService } from '../../services/guide-service';
import { GameService } from '../../services/game-service';
import { ToastService } from '../../services/toast-service';
import { AuthService } from '../../services/auth-service';

describe('GuideEditorPage', () => {
    let component: GuideEditorPage;
    let fixture: ComponentFixture<GuideEditorPage>;

    let guideServiceSpy: any;
    let gameServiceSpy: any;
    let toastServiceSpy: any;
    let authServiceSpy: any;
    let locationSpy: any;

    beforeEach(async () => {
        guideServiceSpy = jasmine.createSpyObj('GuideService', [
            'getGuideById',
            'getGuidesByGameId',
            'createGuide',
            'updateGuide',
            'deleteGuide',
            'uploadScreenshot',
            'deleteScreenshot',
        ]);

        gameServiceSpy = jasmine.createSpyObj('GameService', ['getGame']);

        toastServiceSpy = jasmine.createSpyObj('ToastService', ['showError', 'showSuccess']);

        authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);

        locationSpy = jasmine.createSpyObj('Location', ['back']);

        authServiceSpy.getCurrentUser.and.returnValue({ id: 1 });

        await TestBed.configureTestingModule({
            imports: [GuideEditorPage, FormsModule],
            providers: [
                provideRouter([]),

                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            paramMap: {
                                get: () => null,
                            },
                        },
                    },
                },

                { provide: GuideService, useValue: guideServiceSpy },
                { provide: GameService, useValue: gameServiceSpy },
                { provide: ToastService, useValue: toastServiceSpy },
                { provide: AuthService, useValue: authServiceSpy },
                { provide: Location, useValue: locationSpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GuideEditorPage);
        component = fixture.componentInstance;

        await fixture.whenStable();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should open image preview', () => {
        component.openImage('test.png');

        expect(component.activeImage()).toBe('test.png');
    });

    it('should close image preview', () => {
        component.activeImage.set('test.png');

        component.closeImage();

        expect(component.activeImage()).toBeNull();
    });

    it('should add selected files and previews', () => {
        const file = new File(['data'], 'test.png', { type: 'image/png' });

        spyOn(URL, 'createObjectURL').and.returnValue('blob:test');

        const event = {
            target: {
                files: [file],
                value: '',
            },
        } as unknown as Event;

        component.onFileSelected(event);

        expect(component.selectedFiles.length).toBe(1);
        expect(component.previewUrls.length).toBe(1);
    });

    it('should remove blob screenshot', () => {
        component.previewUrls = ['blob:test'];
        component.selectedFiles = [new File(['data'], 'test.png')];

        spyOn(URL, 'revokeObjectURL');

        component.removeScreenshot(0);

        expect(component.previewUrls.length).toBe(0);
        expect(component.selectedFiles.length).toBe(0);
    });

    it('should mark existing screenshot as deleted', () => {
        component.previewUrls = ['http://localhost:3000/image.png'];

        component.removeScreenshot(0);

        expect(component.deletedScreenshots.length).toBe(1);
    });

    it('should go back', () => {
        component.goBack();

        expect(locationSpy.back).toHaveBeenCalled();
    });

    it('should not submit if form invalid', async () => {
        const form = {
            valid: false,
        } as NgForm;

        await component.onSubmit(form);

        expect(guideServiceSpy.createGuide).not.toHaveBeenCalled();
    });
});
