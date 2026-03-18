import { Achievement } from './achievement';
import { Game } from './game';
import { Guide } from './guide';

export interface User {
    id: number;
    name: string;
    email: string;
    profilePicturePath?: string;
    achievementCount?: number;
    dashboardLayout?: string | string[];
}

export interface UserProfile extends User {
    games: Game[];
    guides: Guide[];
    achievements: Achievement[];
}

export interface UserSummary {
    id: number;
    name: string;
    profilePicturePath: string | null;
    gamesCount: number;
    guidesCount: number;
    achievementsCount: number;
}
