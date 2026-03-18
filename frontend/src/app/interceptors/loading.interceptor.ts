import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const SKIP_LOADING = new HttpContextToken<boolean>(() => false);

let activeRequests = 0;

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
    if (req.context.get(SKIP_LOADING)) {
        return next(req);
    }

    const loaderService = inject(LoadingService);

    activeRequests++;
    if (activeRequests === 1) {
        loaderService.show();
    }

    return next(req).pipe(
        finalize(() => {
            activeRequests--;

            if (activeRequests === 0) {
                loaderService.hide();
            }
        }),
    );
};
