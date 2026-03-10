import { Achievement } from './achievement';
import { Game } from './game';
import { Guide } from './guide';

export interface User {
    id: number;
    name: string;
    email: string;
    profilePicturePath?: string;
    achievementCount?: number; // completed achievements for a selected game
}

export interface UserProfile extends User {
    games: Game[];
    guides: Guide[];
    achievements: Achievement[];
}
