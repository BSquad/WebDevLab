export interface User {
  id: number;
  name: string;
  email: string;
  profilePicturePath?: string;
  achievementCount?: number; // completed achievements for a selected game
}