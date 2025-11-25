export interface Student {
  type: 'student';
  name: string;
  noten: number[];
}

export interface Professor {
  type: 'professor';
  name: string;
  titel: string;
}

export type Participiant = Student | Professor;
