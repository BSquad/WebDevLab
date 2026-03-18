import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
    private _loading = signal(false);
    readonly isLoading = this._loading.asReadonly();
    private timeout: any;

    show() {
        this.timeout = setTimeout(() => {
            this._loading.set(true);
        }, 250);
    }

    hide() {
        clearTimeout(this.timeout);
        this._loading.set(false);
    }
}
