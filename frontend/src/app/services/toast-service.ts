import { Injectable, Injector } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Toast } from '../ui/toast/toast';

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    private overlayRef?: OverlayRef;

    constructor(
        private overlay: Overlay,
        private injector: Injector,
    ) {}

    showSuccess(message: string) {
        this.show(message, 'success');
    }

    showError(message: string) {
        console.error(message);
        this.show(message, 'error');
    }

    show(message: string, type: 'success' | 'error') {
        this.overlayRef?.dispose();

        const position = this.overlay.position().global().top('20px').centerHorizontally();

        this.overlayRef = this.overlay.create({
            positionStrategy: position,
            hasBackdrop: false,
            panelClass: 'toast-panel',
        });

        const injector = Injector.create({
            providers: [
                { provide: 'message', useValue: message },
                { provide: 'type', useValue: type },
            ],
            parent: this.injector,
        });

        const portal = new ComponentPortal(Toast, null, injector);
        this.overlayRef.attach(portal);

        setTimeout(() => this.overlayRef?.dispose(), 2500);
    }
}
