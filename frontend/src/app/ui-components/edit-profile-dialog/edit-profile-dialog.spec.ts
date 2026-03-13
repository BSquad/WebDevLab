import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { EditProfileDialog } from './edit-profile-dialog';

describe('EditProfileDialog', () => {
    let component: EditProfileDialog;
    let fixture: ComponentFixture<EditProfileDialog>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditProfileDialog],
            providers: [
                { provide: MatDialogRef, useValue: {} },
                { provide: MAT_DIALOG_DATA, useValue: {} },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(EditProfileDialog);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
