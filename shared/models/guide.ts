export interface Guide {
    id?: number;
    userId: number;
    author?: string;
    gameId: number;
    title: string;
    content: string;

    createdAt?: string;
    updatedAt?: string;

    avgRating?: number;
    ratingCount?: number;

    pdfPath?: string;
}
