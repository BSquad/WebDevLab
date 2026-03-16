import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-edit-profile-dialog',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
    ],
    templateUrl: './edit-profile-dialog.html',
    styleUrl: './edit-profile-dialog.scss',
})
export class EditProfileDialog {
    private fb = inject(NonNullableFormBuilder);
    private dialogRef = inject(MatDialogRef<EditProfileDialog>);
    public data = inject<{ name: string; email: string; profilePic: string }>(MAT_DIALOG_DATA);

    imagePreview = signal<string | null>(this.data.profilePic || null);
    profilePicture: File | null = null;

    form = this.fb.group({
        name: [this.data.name, [Validators.required]],
        email: [this.data.email, [Validators.required, Validators.email]],
    });

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            this.profilePicture = input.files[0];

            const reader = new FileReader();
            reader.onload = () => this.imagePreview.set(reader.result as string);
            reader.readAsDataURL(this.profilePicture);
        }
    }

    save() {
        if (this.form.valid) {
            this.dialogRef.close({
                ...this.form.getRawValue(),
                file: this.profilePicture,
            });
        }
    }

    cancel() {
        this.dialogRef.close();
    }
}
