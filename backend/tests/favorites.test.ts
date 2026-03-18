import request from 'supertest';
import app from '../src/app.js';

describe('Favorites API – Modul B', () => {
    const testUserId = 1;
    const testGameId = 1;

    it('should add a game to favorites', async () => {
        const response = await request(app).post('/favorites').send({
            userId: testUserId,
            gameId: testGameId,
        });

        expect(response.status).toBe(201); // 🔥 FIX
        expect(response.body.message).toBeDefined(); // 🔥 FIX
    });

    it('should return user favorites', async () => {
        const response = await request(app).get(`/favorites/${testUserId}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should remove a favorite', async () => {
        const response = await request(app).delete(
            `/favorites/${testUserId}/${testGameId}`,
        );

        expect(response.status).toBe(200);
        expect(response.body.message).toBeDefined(); // 🔥 FIX
    });

    it('should return empty list after removal', async () => {
        const response = await request(app).get(`/favorites/${testUserId}`);

        expect(response.status).toBe(200);
        expect(
            response.body.find((g: any) => g.id === testGameId),
        ).toBeUndefined();
    });
});
