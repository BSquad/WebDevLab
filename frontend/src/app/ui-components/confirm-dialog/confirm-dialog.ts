import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-confirm-dialog',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule, MatIcon],
    templateUrl: './confirm-dialog.html',
    styleUrl: './confirm-dialog.scss',
})
export class ConfirmDialog {
    readonly dialogRef = inject(MatDialogRef<ConfirmDialog>);
    readonly data = inject<{ title: string; message: string }>(MAT_DIALOG_DATA);

    onConfirm(): void {
        this.dialogRef.close(true);
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }
}
