import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { GuideService } from '../../services/guide-service';
import { ReadGuidePage } from './read-guide-page';
import { Guide } from '../../../../../shared/models/guide';
import { ToastService } from '../../services/toast-service';
import { AuthService } from '../../services/auth-service';

describe('ReadGuidePage', () => {
    let component: ReadGuidePage;
    let fixture: ComponentFixture<ReadGuidePage>;

    let guideServiceSpy: any;
    let toastServiceSpy: any;
    let authServiceSpy: any;
    let locationSpy: any;

    function createGuideMock(): Guide {
        return {
            id: 1,
            userId: 1,
            gameId: 1,
            title: 'Test Guide',
            content: 'Test Content',
            author: 'Tester',
            createdAt: '2024-01-01',
            avgRating: 4,
            screenshots: [],
        };
    }

    beforeEach(async () => {
        guideServiceSpy = jasmine.createSpyObj('GuideService', [
            'getGuideById',
            'rateGuide',
            'downloadPdf',
        ]);

        toastServiceSpy = jasmine.createSpyObj('ToastService', ['showError', 'showSuccess']);

        authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);

        locationSpy = jasmine.createSpyObj('Location', ['back']);

        await TestBed.configureTestingModule({
            imports: [ReadGuidePage],
            providers: [
                provideRouter([]),

                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            paramMap: {
                                get: () => '1',
                            },
                        },
                    },
                },

                { provide: Location, useValue: locationSpy },
                { provide: GuideService, useValue: guideServiceSpy },
                { provide: ToastService, useValue: toastServiceSpy },
                { provide: AuthService, useValue: authServiceSpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ReadGuidePage);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load guide on init', async () => {
        const guide = createGuideMock();

        guideServiceSpy.getGuideById.and.resolveTo(guide);

        await component.ngOnInit();

        expect(component.guide()?.title).toBe('Test Guide');
    });

    it('should rate guide', async () => {
        component.guide.set(createGuideMock());

        authServiceSpy.getCurrentUser.and.returnValue({ id: 10 });

        await component.rateGuide(5);

        expect(guideServiceSpy.rateGuide).toHaveBeenCalledWith(1, 5, 10);
        expect(component.rating()).toBe(5);
        expect(toastServiceSpy.showSuccess).toHaveBeenCalled();
    });

    it('should not rate if no user', async () => {
        component.guide.set(createGuideMock());

        authServiceSpy.getCurrentUser.and.returnValue(null);

        await component.rateGuide(4);

        expect(guideServiceSpy.rateGuide).not.toHaveBeenCalled();
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

    it('should download pdf', async () => {
        const blob = new Blob(['test'], { type: 'application/pdf' });

        component.guide.set(createGuideMock());

        guideServiceSpy.downloadPdf.and.resolveTo(blob);

        spyOn(window.URL, 'createObjectURL').and.returnValue('blob:test');
        spyOn(document, 'createElement').and.callThrough();

        await component.downloadPDF();

        expect(guideServiceSpy.downloadPdf).toHaveBeenCalledWith(1);
        expect(window.URL.createObjectURL).toHaveBeenCalled();
    });

    it('should handle pdf download error', async () => {
        component.guide.set(createGuideMock());

        guideServiceSpy.downloadPdf.and.rejectWith(new Error());

        await component.downloadPDF();

        expect(toastServiceSpy.showError).toHaveBeenCalled();
    });

    it('should go back', () => {
        component.goBack();

        expect(locationSpy.back).toHaveBeenCalled();
    });
});
