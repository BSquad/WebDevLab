import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoadParticipiants } from '../../services/load-participiants';
import { Participiant, Student, Professor } from '../../models/entities';

@Component({
  selector: 'app-participiant-list',
  imports: [CommonModule],
  templateUrl: './participiant-list.html',
  styleUrl: './participiant-list.scss',
  standalone: true,
})
export class ParticipiantList { 
  participiants: Participiant[] = [];

  constructor(private service: LoadParticipiants, private router: Router) {
    this.participiants = this.service.getTeilnehmer();
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  getNoten(student: Participiant): number[] {
    if (student.type === 'student') return (student as Student).noten;
    return [];
  }

  getTitel(prof: Participiant): string {
    if (prof.type === 'professor') return (prof as Professor).titel;
    return '';
  }
}
