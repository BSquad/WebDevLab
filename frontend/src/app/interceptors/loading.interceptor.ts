import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, throwError, timeout } from 'rxjs';
import { LoadingService } from '../services/loading.service';

let activeRequests = 0;

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
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
