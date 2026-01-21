export interface Game {
  id?: number;
  title: string;
  description?: string;
  genre?: string;
  tags?: string;
  platform?: string;
  developer: string;
  publisher?: string;
  releaseDate: string;
  popularityScore?: number;
}