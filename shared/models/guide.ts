export interface Guide {
  id?: number;
  authorId: number;
  author?: string;
  gameId: number;
  title: string;
  content: string;
  pdfPath?: string;
  createdAt?: string;
}
