import request from 'supertest';
import app from '../src/app.js';

describe('Comments API – Modul C', () => {
    const testUserId = 1;
    const testGuideId = 1;

    it('should add a comment', async () => {
        const response = await request(app).post('/comments').send({
            userId: testUserId,
            guideId: testGuideId,
            commentText: 'Great guide!',
        });

        expect(response.status).toBe(200);
        expect(response.body).toBe(true);
    });

    it('should return comments for a guide', async () => {
        const response = await request(app).get(`/comments/${testGuideId}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should reject empty comment', async () => {
        const response = await request(app).post('/comments').send({
            userId: testUserId,
            guideId: testGuideId,
            commentText: '',
        });

        expect(response.status).toBe(500);
    });
});
