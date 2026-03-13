import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast-service';
import { Overlay } from '@angular/cdk/overlay';

describe('ToastService', () => {
    let service: ToastService;
    let overlayMock: jasmine.SpyObj<Overlay>;

    beforeEach(() => {
        overlayMock = jasmine.createSpyObj('Overlay', ['position', 'create']);

        TestBed.configureTestingModule({
            providers: [ToastService, { provide: Overlay, useValue: overlayMock }],
        });
        service = TestBed.inject(ToastService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call show with success type', () => {
        const showSpy = spyOn(service, 'show' as any);

        service.showSuccess('Success message');

        expect(showSpy).toHaveBeenCalledWith('Success message', 'success');
    });

    it('should log error to console and call show with error type', () => {
        const consoleSpy = spyOn(console, 'error');
        const showSpy = spyOn(service, 'show' as any);

        service.showError('Error message');

        expect(consoleSpy).toHaveBeenCalledWith('Error message');
        expect(showSpy).toHaveBeenCalledWith('Error message', 'error');
    });

    it('should dispose existing overlay before creating new one', () => {
        const disposeSpy = jasmine.createSpy('dispose');
        service['overlayRef'] = { dispose: disposeSpy } as any;

        const positionStrategy = { centerHorizontally: jasmine.createSpy('centerHorizontally') };
        const positionSpy = jasmine.createSpyObj('PositionStrategy', ['global']);
        positionSpy.global.and.returnValue({
            top: jasmine.createSpy('top').and.returnValue(positionStrategy),
        });
        overlayMock.position.and.returnValue(positionSpy);

        const overlayRefSpy = jasmine.createSpyObj('OverlayRef', ['attach', 'dispose']);
        overlayRefSpy.attach.and.returnValue(null);
        overlayMock.create.and.returnValue(overlayRefSpy);

        service.show('Test message', 'success');

        expect(disposeSpy).toHaveBeenCalled();
    });

    it('should create overlay with correct configuration', () => {
        const positionStrategy: any = {
            top: jasmine.createSpy('top'),
            centerHorizontally: jasmine.createSpy('centerHorizontally'),
        };

        positionStrategy.top.and.returnValue(positionStrategy);
        positionStrategy.centerHorizontally.and.returnValue(positionStrategy);

        const positionSpy = jasmine.createSpyObj('OverlayPositionBuilder', ['global']);
        positionSpy.global.and.returnValue(positionStrategy);

        overlayMock.position.and.returnValue(positionSpy);

        const overlayRefSpy = jasmine.createSpyObj('OverlayRef', ['attach', 'dispose']);
        overlayRefSpy.attach.and.returnValue(null);
        overlayMock.create.and.returnValue(overlayRefSpy);

        service.show('Test message', 'error');

        expect(overlayMock.position).toHaveBeenCalled();
        expect(positionSpy.global).toHaveBeenCalled();
        expect(overlayMock.create).toHaveBeenCalledWith({
            positionStrategy: jasmine.any(Object),
            hasBackdrop: false,
            panelClass: 'toast-panel',
        });
    });

    it('should set timeout to dispose overlay', () => {
        const positionStrategy: any = {
            top: jasmine.createSpy('top'),
            centerHorizontally: jasmine.createSpy('centerHorizontally'),
        };

        positionStrategy.top.and.returnValue(positionStrategy);
        positionStrategy.centerHorizontally.and.returnValue(positionStrategy);

        const positionSpy = jasmine.createSpyObj('OverlayPositionBuilder', ['global']);
        positionSpy.global.and.returnValue(positionStrategy);

        overlayMock.position.and.returnValue(positionSpy);

        const overlayRefSpy = jasmine.createSpyObj('OverlayRef', ['attach', 'dispose']);
        overlayRefSpy.attach.and.returnValue(null);
        overlayMock.create.and.returnValue(overlayRefSpy);

        jasmine.clock().install();
        service.show('Test message', 'success');

        expect(overlayRefSpy.dispose).not.toHaveBeenCalled();

        jasmine.clock().tick(2500);

        expect(overlayRefSpy.dispose).toHaveBeenCalled();
        jasmine.clock().uninstall();
    });
});
