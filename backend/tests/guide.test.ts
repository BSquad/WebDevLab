import request from 'supertest';
import app from '../src/app.js';

describe('Guide API – Modul A', () => {
    let createdGuideId: number;

    it('should create a guide', async () => {
        const response = await request(app).post('/guides').send({
            userId: 1,
            gameId: 1,
            title: 'Integration Test Guide',
            content: 'This is a test guide',
        });

        expect(response.status).toBe(200);

        expect(typeof response.body).toBe('number');
        expect(response.body).toBeGreaterThan(0);

        createdGuideId = response.body;
    });

    it('should return guides by gameId', async () => {
        const response = await request(app).get('/guides/game/1');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);

        const guide = response.body.find(
            (g: any) => g.title === 'Integration Test Guide',
        );

        expect(guide).toBeDefined();
        createdGuideId = guide.id;
    });

    it('should return guide by id', async () => {
        const response = await request(app).get(`/guides/${createdGuideId}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(createdGuideId);
    });

    it('should update guide', async () => {
        const response = await request(app)
            .put(`/guides/${createdGuideId}`)
            .send({
                userId: 1,
                title: 'Updated Title',
                content: 'Updated Content',
            });

        expect(response.status).toBe(200);
        expect(response.body).toBe(true);

        const check = await request(app).get(`/guides/${createdGuideId}`);

        expect(check.body.title).toBe('Updated Title');
    });

    it('should rate guide', async () => {
        const response = await request(app)
            .post(`/guides/${createdGuideId}/rate`)
            .send({
                userId: 1,
                rating: 5,
            });

        expect(response.status).toBe(200);
        expect(response.body).toBe(true);
    });

    it('should reject invalid rating', async () => {
        const response = await request(app)
            .post(`/guides/${createdGuideId}/rate`)
            .send({
                userId: 1,
                score: 10,
            });

        expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it('should return top guides', async () => {
        const response = await request(app).get('/guides/top/1');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeLessThanOrEqual(3);
    });

    it('should download guide as pdf', async () => {
        const response = await request(app).get(
            `/guides/${createdGuideId}/pdf`,
        );

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toContain('application/pdf');
    });

    it('should upload screenshot', async () => {
        const response = await request(app)
            .post(`/guides/${createdGuideId}/upload`)
            .attach('image', Buffer.from('test'), 'test.png');

        expect(response.status).toBe(200);
    });

    it('should delete guide', async () => {
        const response = await request(app)
            .delete(`/guides/${createdGuideId}`)
            .send({ userId: 1 });

        expect(response.status).toBe(200);
        expect(response.body).toBe(true);
    });
});
