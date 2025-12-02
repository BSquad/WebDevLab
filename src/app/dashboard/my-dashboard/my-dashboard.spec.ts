/// <reference types="jasmine" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { MyDashboard } from './my-dashboard';

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('MyDashboard', () => {
  let component: MyDashboard;
  let fixture: ComponentFixture<MyDashboard>;
  let router: MockRouter;

  beforeEach(async () => {
    router = new MockRouter();

    await TestBed.configureTestingModule({
      imports: [MyDashboard],
      providers: [
        { provide: Router, useValue: router },
        provideRouter([]) // falls notwendig, sonst entfernen
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MyDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /fibonacci when goToFibonacci is called', () => {
    component.goToFibonacci();
    expect(router.navigate).toHaveBeenCalledWith(['/fibonacci']);
  });

  it('should navigate to /author-info when goToAuthorInfo is called', () => {
    component.goToAuthorInfo();
    expect(router.navigate).toHaveBeenCalledWith(['/author-info']);
  });

  it('should navigate to /participant-list when goToParticipantList is called', () => {
    component.goToParticipantList();
    expect(router.navigate).toHaveBeenCalledWith(['/participant-list']);
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
