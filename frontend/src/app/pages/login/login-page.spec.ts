/// <reference types="jasmine" />
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { LoginPage } from './login-page';

describe('Login', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPage, FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit invalid form', () => {
    const form = {} as NgForm;
    // spyOn(form, 'valid').and.returnValue(false); //TODO
    component.onSubmit(form);
    expect(component.submitted).toBeFalse();
  });

  it('should submit valid form', () => {
    const form = {} as NgForm;
    // spyOn(form, 'valid').and.returnValue(true); //TODO
    component.username = 'Max';
    component.password = '123';
    component.onSubmit(form);
    expect(component.submitted).toBeTrue();
  });

  it('should render login message after submit', () => {
    component.username = 'Max';
    component.password = '123';
    component.submitted = true;
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.textContent).toContain('Login erfolgreich für Max');
  });
});
