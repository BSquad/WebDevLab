export interface Student {
  type: 'student';
  name: string;
  noten: number[];
  semester: number;
}

export interface Professor {
  type: 'professor';
  name: string;
  titel: string;
}

export type Participant = Student | Professor;
