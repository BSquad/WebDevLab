export interface Guide {
  id?: number;
  userId: number;
  author?: string;
  gameId: number;
  title: string;
  content: string;
  pdfPath?: string;
  createdAt?: string;
}
