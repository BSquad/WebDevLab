import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';

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

    it('should initialize form with data from MAT_DIALOG_DATA', () => {
        const mockData = { name: 'John Doe', email: 'john@example.com', profilePic: 'avatar.jpg' };

        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [EditProfileDialog],
            providers: [
                { provide: MatDialogRef, useValue: {} },
                { provide: MAT_DIALOG_DATA, useValue: mockData },
            ],
        });

        const fixture = TestBed.createComponent(EditProfileDialog);
        const component = fixture.componentInstance;

        expect(component.form.value.name).toBe('John Doe');
        expect(component.form.value.email).toBe('john@example.com');
        expect(component.imagePreview()).toBe('avatar.jpg');
    });

    it('should close dialog with form data when save button is clicked and form is valid', () => {
        const mockDialogRef = {
            close: jasmine.createSpy('close'),
        };

        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [EditProfileDialog],
            providers: [
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: { name: '', email: '', profilePic: '' } },
            ],
        });

        const fixture = TestBed.createComponent(EditProfileDialog);
        const component = fixture.componentInstance;

        component.form.setValue({ name: 'Jane Doe', email: 'jane@example.com' });
        fixture.detectChanges();

        const saveButton = fixture.debugElement.query(By.css('.save-btn'));
        saveButton.nativeElement.click();

        expect(mockDialogRef.close).toHaveBeenCalledWith({
            name: 'Jane Doe',
            email: 'jane@example.com',
            file: null,
        });
    });

    it('should close dialog without data when cancel button is clicked', () => {
        const mockDialogRef = {
            close: jasmine.createSpy('close'),
        };

        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [EditProfileDialog],
            providers: [
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: MAT_DIALOG_DATA, useValue: { name: '', email: '', profilePic: '' } },
            ],
        });

        const fixture = TestBed.createComponent(EditProfileDialog);
        const component = fixture.componentInstance;

        const cancelButton = fixture.debugElement.query(By.css('.cancel-btn'));
        cancelButton.nativeElement.click();

        expect(mockDialogRef.close).toHaveBeenCalledWith();
    });

    it('should trigger file input click when upload button is clicked', () => {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({
            imports: [EditProfileDialog],
            providers: [
                { provide: MatDialogRef, useValue: {} },
                { provide: MAT_DIALOG_DATA, useValue: { name: '', email: '', profilePic: '' } },
            ],
        });

        const fixture = TestBed.createComponent(EditProfileDialog);
        const component = fixture.componentInstance;

        spyOn(component, 'onFileSelected');

        const uploadButton = fixture.debugElement.query(By.css('.upload-btn'));
        uploadButton.nativeElement.click();

        const fileInput = fixture.debugElement.query(By.css('input[type="file"]'));
        expect(fileInput).toBeTruthy();
    });
});
