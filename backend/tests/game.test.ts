import request from 'supertest';
import app from '../src/app.js';

describe('Games API – Modul D', () => {
    const testUserId = 1;
    const testUserId2 = 2;
    const testGameId = 1;
    const testGameId2 = 2;
    const testAchievementId = 1;
    const testAchievementId2 = 2;

    it('should return all games', async () => {
        const response = await request(app).get('/games');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return all games with user tracking info', async () => {
        const response = await request(app).get('/games?userId=1');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return game by id', async () => {
        const response = await request(app).get(`/games/${testGameId}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(testGameId);
        expect(response.body.title).toBeDefined();
    });

    it('should return 404 for non-existent game', async () => {
        const response = await request(app).get('/games/999999');
        expect(response.status).toBe(404);
    });

    it('should return 400 for invalid game ID format', async () => {
        const response = await request(app).get('/games/abc');
        expect(response.status).toBe(400);
    });

    it('should return game by id with user tracking info', async () => {
        const response = await request(app).get(
            `/games/${testGameId}?userId=1`,
        );

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(testGameId);
        expect(response.body.title).toBeDefined();
    });

    it('should return popular games', async () => {
        const response = await request(app).get('/games/popular');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return achievements for game', async () => {
        const response = await request(app).get(
            `/games/${testGameId}/achievements`,
        );

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return achievements for game with user completion status', async () => {
        const response = await request(app).get(
            `/games/${testGameId}/achievements?userId=1`,
        );

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should complete achievement for user', async () => {
        const response = await request(app)
            .post(
                `/games/${testGameId}/achievements/${testAchievementId}/complete`,
            )
            .query({ userId: testUserId });

        expect(response.status).toBe(200);
        expect(response.body.message).toBeDefined();
    });

    it('should handle already completed achievement', async () => {
        await request(app)
            .post(
                `/games/${testGameId}/achievements/${testAchievementId2}/complete`,
            )
            .query({ userId: testUserId });

        const response = await request(app)
            .post(
                `/games/${testGameId}/achievements/${testAchievementId2}/complete`,
            )
            .query({ userId: testUserId });

        expect(response.status).toBe(409);
        expect(response.body.message).toBe('Achievement already completed');
    });

    it('should handle invalid achievement references', async () => {
        const response = await request(app)
            .post('/games/999999/achievements/999999/complete')
            .query({ userId: 999999 });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Resource not found');
    });

    it('should toggle ON game tracking for user', async () => {
        const response = await request(app)
            .post(`/games/${testGameId}/track`)
            .send({ isTracked: true })
            .query({ userId: testUserId });

        expect(response.status).toBe(200);
        expect(response.body.message).toBeDefined();
    });

    it('should return 400 if isTracked is not a boolean', async () => {
        const response = await request(app)
            .post(`/games/${testGameId}/track`)
            .send({ isTracked: 'yes' })
            .query({ userId: testUserId });

        expect(response.status).toBe(400);
    });

    it('should toggle OFF game tracking for user', async () => {
        const response = await request(app)
            .post(`/games/${testGameId}/track`)
            .send({ isTracked: false })
            .query({ userId: testUserId });

        expect(response.status).toBe(200);
        expect(response.body.message).toBeDefined();
    });

    it('should return best users for game', async () => {
        const response = await request(app).get(
            `/games/${testGameId}/best-users`,
        );

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});
