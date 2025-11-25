import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MyDashboard } from './dashboard/my-dashboard/my-dashboard';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MyDashboard],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('WebDevLab');
}
