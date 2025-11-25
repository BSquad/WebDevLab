import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoadParticipants } from '../../services/load-participants';
import { Participant, Student, Professor } from '../../models/entities';

@Component({
  selector: 'app-participant-list',
  imports: [CommonModule],
  templateUrl: './participant-list.html',
  styleUrl: './participant-list.scss',
  standalone: true,
})
export class ParticipantList { 
  participants: Participant[] = [];

  constructor(private service: LoadParticipants, private router: Router) {
    this.participants = this.service.getTeilnehmer();
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  getNoten(student: Participant): number[] {
    if (student.type === 'student') return (student as Student).noten;
    return [];
  }

  getTitel(prof: Participant): string {
    if (prof.type === 'professor') return (prof as Professor).titel;
    return '';
  }
}
