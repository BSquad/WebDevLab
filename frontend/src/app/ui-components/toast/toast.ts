import { Component, Inject } from '@angular/core';

@Component({
    selector: 'toast',
    imports: [],
    templateUrl: './toast.html',
    styleUrl: './toast.scss',
    standalone: true,
})
export class Toast {
    constructor(
        @Inject('message') public message: string,
        @Inject('type') public type: 'success' | 'error',
    ) {}
}
