import request from 'supertest';
import app from '../src/app.js';

describe('Games API – Modul D', () => {
    const testUserId = 1;
    const testGameId = 1;
    const testAchievementId = 1;

    // -----------------------------
    // GET ALL GAMES
    // -----------------------------
    it('should return all games', async () => {
        const response = await request(app).get('/games');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    // -----------------------------
    // GET ALL GAMES WITH USER ID
    // -----------------------------
    it('should return all games with user tracking info', async () => {
        const response = await request(app).get('/games?userId=1');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    // -----------------------------
    // GET GAME BY ID
    // -----------------------------
    it('should return game by id', async () => {
        const response = await request(app).get(`/games/${testGameId}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(testGameId);
        expect(response.body.title).toBeDefined();
    });

    // -----------------------------
    // GET GAME BY ID WITH USER ID
    // -----------------------------
    it('should return game by id with user tracking info', async () => {
        const response = await request(app).get(
            `/games/${testGameId}?userId=1`,
        );

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(testGameId);
        expect(response.body.title).toBeDefined();
    });

    // -----------------------------
    // GET POPULAR GAMES
    // -----------------------------
    it('should return popular games', async () => {
        const response = await request(app).get('/games/popular');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    // -----------------------------
    // GET ACHIEVEMENTS BY GAME ID
    // -----------------------------
    it('should return achievements for game', async () => {
        const response = await request(app).get(
            `/games/${testGameId}/achievements`,
        );

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    // -----------------------------
    // GET ACHIEVEMENTS BY GAME ID WITH USER ID
    // -----------------------------
    it('should return achievements for game with user completion status', async () => {
        const response = await request(app).get(
            `/games/${testGameId}/achievements?userId=1`,
        );

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    // -----------------------------
    // COMPLETE ACHIEVEMENT
    // -----------------------------
    it('should complete achievement for user', async () => {
        const response = await request(app)
            .post(
                `/games/${testGameId}/achievements/${testAchievementId}/complete`,
            )
            .send({ isTracked: true })
            .query({ userId: testUserId });

        expect(response.status).toBe(200);
        expect(response.body).toBe(true);
    });

    // -----------------------------
    // TOGGLE TRACK GAME
    // -----------------------------
    it('should toggle game tracking for user', async () => {
        const response = await request(app)
            .post(`/games/${testGameId}/track`)
            .send({ isTracked: true })
            .query({ userId: testUserId });

        expect(response.status).toBe(200);
        expect(response.body).toBe(true);
    });

    // -----------------------------
    // GET BEST USERS BY GAME ID
    // -----------------------------
    it('should return best users for game', async () => {
        const response = await request(app).get(
            `/games/${testGameId}/best-users`,
        );

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});
