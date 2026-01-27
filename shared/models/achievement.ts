export interface Achievement {
  id: number;
  gameId: number;
  title: string;
  description: string;
  iconPath?: string;
  isCompleted: boolean; // for the current user
}
