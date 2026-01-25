export interface Guide {
  id?: number;
  authorId: number;
  gameId: number;
  title: string;
  content: string;
  pdfPath?: string;
  createdAt?: string;
}
