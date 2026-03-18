import { Game } from './game';

export interface Guide {
    id?: number;
    userId: number;
    author?: string;
    gameId: number;
    game?: Game;
    title: string;
    content: string;

    createdAt?: string;
    updatedAt?: string;

    avgRating?: number;
    ratingCount?: number;

    screenshots?: string[];
}
