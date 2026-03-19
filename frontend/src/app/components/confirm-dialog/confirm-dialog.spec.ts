import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialog } from './confirm-dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('ConfirmDialog', () => {
    let component: ConfirmDialog;
    let fixture: ComponentFixture<ConfirmDialog>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ConfirmDialog],
            providers: [
                { provide: MatDialogRef, useValue: {} },
                { provide: MAT_DIALOG_DATA, useValue: {} }, // 🔥 das fehlte
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ConfirmDialog);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
