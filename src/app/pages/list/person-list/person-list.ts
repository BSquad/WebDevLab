import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestApi } from '../../../api/rest-api';
import { Person } from '../../../models/person';

@Component({
  selector: 'app-person-list',
  imports: [CommonModule],
  templateUrl: './person-list.html',
  styleUrl: './person-list.scss',
  standalone: true
})
export class PersonList {
  persons: any = signal<Person[]>([]);

  constructor(private restApi: RestApi) {  }

  async ngOnInit() {
    try {
      const data = await this.restApi.loadPersonList();
      this.persons.set(data);
    } catch (err) {
      console.error('Fehler beim Laden:', err);
    }
  }
}
