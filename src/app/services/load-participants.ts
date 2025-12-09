import { Injectable } from '@angular/core';
import { Participant, Student, Professor } from '../models/entities';

@Injectable({
  providedIn: 'root',
})
export class LoadParticipants {
  getTeilnehmer(): Participant[] {
    return [
      { type: 'student', name: 'Max Mustermann', noten: [1, 2], semester: 2 } as Student,
      { type: 'professor', name: 'Dr. Müller', titel: 'Professor' } as Professor,
      { type: 'student', name: 'Anna Schmidt', noten: [2, 3, 2, 4], semester: 4 } as Student,
      { type: 'professor', name: 'Dr. Meier', titel: 'Privatdozent' } as Professor
    ];
  }
}
