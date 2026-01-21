export interface GuideComment {
  id?: number;
  userId: number;
  guideId: number;
  commentText: string;
  createdAt?: string;
}
