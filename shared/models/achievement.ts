export interface Achievement {
    id: number;
    gameId: number;
    title: string;
    description: string;
    difficulty: AchievementTier;
    isCompleted: boolean;
}

export enum AchievementTier {
    Bronze = 'bronze',
    Silver = 'silver',
    Gold = 'gold',
    Platinum = 'platinum',
}
