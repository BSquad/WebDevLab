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
            'rateGuideAndRefresh',
            'downloadPdfFile',
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

        guideServiceSpy.rateGuideAndRefresh.and.resolveTo(createGuideMock());

        await component.rateGuide(5);

        expect(guideServiceSpy.rateGuideAndRefresh).toHaveBeenCalledWith(1, 5, 10);
        expect(component.rating()).toBe(5);
        expect(toastServiceSpy.showSuccess).toHaveBeenCalled();
    });

    it('should not rate if no user', async () => {
        component.guide.set(createGuideMock());
        authServiceSpy.getCurrentUser.and.returnValue(null);

        await component.rateGuide(4);

        expect(guideServiceSpy.rateGuideAndRefresh).not.toHaveBeenCalled();
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
        component.guide.set(createGuideMock());

        guideServiceSpy.downloadPdfFile.and.resolveTo();

        await component.downloadPDF();

        expect(guideServiceSpy.downloadPdfFile).toHaveBeenCalledWith(1);
    });

    it('should handle pdf download error', async () => {
        component.guide.set(createGuideMock());

        guideServiceSpy.downloadPdfFile.and.rejectWith(new Error());

        await component.downloadPDF();

        expect(toastServiceSpy.showError).toHaveBeenCalled();
    });

    it('should go back', () => {
        component.goBack();
        expect(locationSpy.back).toHaveBeenCalled();
    });

    describe('template interactions', () => {
        it('should call goBack on button click', () => {
            spyOn(component, 'goBack');

            fixture.detectChanges();

            fixture.nativeElement.querySelector('.back-button').click();

            expect(component.goBack).toHaveBeenCalled();
        });

        it('should call rateGuide when star is clicked', () => {
            component.guide.set(createGuideMock());
            spyOn(component, 'rateGuide');

            fixture.detectChanges();

            const stars = fixture.nativeElement.querySelectorAll('.star');
            stars[0].click();

            expect(component.rateGuide).toHaveBeenCalledWith(1);
        });

        it('should set hoverRating on mouse enter and leave', () => {
            component.guide.set(createGuideMock());

            fixture.detectChanges();

            const stars = fixture.nativeElement.querySelectorAll('.star');

            stars[0].dispatchEvent(new Event('mouseenter'));
            fixture.detectChanges();
            expect(component.hoverRating()).toBe(1);

            stars[0].dispatchEvent(new Event('mouseleave'));
            fixture.detectChanges();
            expect(component.hoverRating()).toBe(0);
        });

        it('should call downloadPDF on button click', () => {
            spyOn(component, 'downloadPDF');

            fixture.detectChanges();

            fixture.nativeElement.querySelector('.submit-button').click();

            expect(component.downloadPDF).toHaveBeenCalled();
        });

        it('should render screenshots and open image on click', () => {
            const guide = createGuideMock();
            guide.screenshots = ['/img.png'];

            component.guide.set(guide);
            spyOn(component, 'openImage');

            fixture.detectChanges();

            const img = fixture.nativeElement.querySelector('.guide-screenshot');
            img.click();

            expect(component.openImage).toHaveBeenCalledWith('http://localhost:3000/img.png');
        });

        it('should close image when overlay is clicked', () => {
            component.activeImage.set('test.png');
            spyOn(component, 'closeImage');

            fixture.detectChanges();

            fixture.nativeElement.querySelector('.image-overlay').click();

            expect(component.closeImage).toHaveBeenCalled();
        });

        it('should stop propagation inside modal', () => {
            component.activeImage.set('test.png');

            fixture.detectChanges();

            const modal = fixture.nativeElement.querySelector('.image-modal');

            const event = new Event('click');
            spyOn(event, 'stopPropagation');

            modal.dispatchEvent(event);

            expect(event.stopPropagation).toHaveBeenCalled();
        });

        it('should render comments component when guide has id', () => {
            component.guide.set(createGuideMock());

            fixture.detectChanges();

            expect(fixture.nativeElement.querySelector('app-comments')).toBeTruthy();
        });
    });
});
