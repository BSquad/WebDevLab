import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { MyDashboard } from './my-dashboard';

describe('MyDashboard', () => {
  let component: MyDashboard;
  let fixture: ComponentFixture<MyDashboard>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyDashboard],
      providers: [
        provideRouter([])
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MyDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /fibonacci when goToFibonacci is called', () => {
    const spy = vi.spyOn(router, 'navigate');
    component.goToFibonacci();
    expect(spy).toHaveBeenCalledWith(['/fibonacci']);
  });

  it('should navigate to /author-info when goToAuthorInfo is called', () => {
    const spy = vi.spyOn(router, 'navigate');
    component.goToAuthorInfo();
    expect(spy).toHaveBeenCalledWith(['/author-info']);
  });

  it('should navigate to /participant-list when goToParticipantList is called', () => {
    const spy = vi.spyOn(router, 'navigate');
    component.goToParticipantList();
    expect(spy).toHaveBeenCalledWith(['/participant-list']);
  });

  it('should render the correct amount of dashboard tiles', () => {
    const element = fixture.nativeElement as HTMLElement;
    const tiles = element.querySelectorAll('.dashboard-tile');
    expect(tiles.length).toBe(3);
  });

  it('should render the correct tile titles', () => {
    const element = fixture.nativeElement as HTMLElement;
    const tileTitles = Array.from(element.querySelectorAll('.dashboard-tile h2'))
      .map(h => h.textContent?.trim());

    expect(tileTitles).toContain('Fibonacci Rechner');
    expect(tileTitles).toContain('Author Info');
    expect(tileTitles).toContain('Teilnehmerliste');
  });
});