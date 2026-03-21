import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { ToastService } from '../services/toast-service';

@Injectable({
    providedIn: 'root',
})
export class BaseApi {
    protected apiUrl = 'http://localhost:3000';

    constructor(
        protected http: HttpClient,
        private toast: ToastService,
    ) {}

    async request<T>(obs: Observable<T>, options?: { showError?: boolean }): Promise<T> {
        try {
            return await firstValueFrom(obs);
        } catch (err: any) {
            const message = err?.error?.message || err?.message || 'Unknown Error';

            if (options?.showError !== false) {
                this.toast.showError(message);
            }

            err.message = message;

            throw err;
        }
    }
}
