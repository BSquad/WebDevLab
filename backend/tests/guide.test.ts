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

        expect(response.status).toBe(201);
        expect(response.body.id).toBeGreaterThan(0);

        createdGuideId = response.body.id;
    });

    it('should reject invalid guide creation', async () => {
        const response = await request(app).post('/guides').send({
            userId: 1,
            content: 'Invalid',
        });

        expect(response.status).toBeGreaterThanOrEqual(400);
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

    it('should return guides by userId', async () => {
        const response = await request(app).get('/guides/user/1');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return guide by id', async () => {
        const response = await request(app).get(`/guides/${createdGuideId}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(createdGuideId);
    });

    it('should return error for non-existing guide', async () => {
        const response = await request(app).get('/guides/999999');

        expect(response.status).toBeGreaterThanOrEqual(400);
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
        expect(response.body.message).toBeDefined();

        const check = await request(app).get(`/guides/${createdGuideId}`);

        expect(check.body.title).toBe('Updated Title');
        expect(check.body.content).toBe('Updated Content');
    });

    it('should fail update for non-existing guide', async () => {
        const response = await request(app).put('/guides/999999').send({
            userId: 1,
            title: 'Fail',
            content: 'Fail',
        });

        expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it('should reject update from wrong user', async () => {
        const response = await request(app)
            .put(`/guides/${createdGuideId}`)
            .send({
                userId: 999,
                title: 'Hacked',
                content: 'Hacked',
            });

        expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it('should rate guide', async () => {
        const response = await request(app)
            .post(`/guides/${createdGuideId}/rate`)
            .send({
                userId: 1,
                rating: 5,
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBeDefined();
    });

    it('should reject rating above range', async () => {
        const response = await request(app)
            .post(`/guides/${createdGuideId}/rate`)
            .send({
                userId: 1,
                rating: 10,
            });

        expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it('should reject rating below range', async () => {
        const response = await request(app)
            .post(`/guides/${createdGuideId}/rate`)
            .send({
                userId: 1,
                rating: 0,
            });

        expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it('should return top guides', async () => {
        const response = await request(app).get('/guides/top/1');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeLessThanOrEqual(3);
    });

    it('should generate pdf with author and createdAt', async () => {
        const res = await request(app)
            .post('/guides')
            .send({
                userId: 1,
                gameId: 1,
                title: 'Guide with Meta ' + Date.now(),
                content: 'Test',
            });

        expect(res.status).toBe(201);

        const id = res.body.id;

        const pdf = await request(app).get(`/guides/${id}/pdf`);

        expect(pdf.status).toBe(200);
    });

    it('should generate pdf without screenshot', async () => {
        const res = await request(app)
            .post('/guides')
            .send({
                userId: 1,
                gameId: 1,
                title: 'Broken Screenshot ' + Date.now(),
                content: 'Test',
            });

        expect(res.status).toBe(201);

        const id = res.body.id;

        await request(app)
            .post(`/guides/${id}/upload`)
            .attach('image', Buffer.from('fake'), 'fake.png');

        const pdf = await request(app).get(`/guides/${id}/pdf`);

        expect(pdf.status).toBe(200);
    });

    it('should download guide as pdf', async () => {
        const response = await request(app).get(
            `/guides/${createdGuideId}/pdf`,
        );

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toContain('application/pdf');
    });

    it('should fail pdf generation for non-existing guide', async () => {
        const response = await request(app).get('/guides/999999/pdf');

        expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it('should upload screenshot', async () => {
        const response = await request(app)
            .post(`/guides/${createdGuideId}/upload`)
            .attach('image', Buffer.from('test'), 'test.png');

        expect(response.status).toBe(200);
        expect(response.body.path).toBeDefined();
    });

    it('should delete screenshot', async () => {
        const response = await request(app)
            .delete(`/guides/${createdGuideId}/screenshot`)
            .send({ filePath: 'test.png' });

        expect(response.status).toBeGreaterThanOrEqual(200);
    });

    it('should reject upload without file', async () => {
        const response = await request(app).post(
            `/guides/${createdGuideId}/upload`,
        );

        expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it('should reject delete from wrong user', async () => {
        const response = await request(app)
            .delete(`/guides/${createdGuideId}`)
            .send({ userId: 999 });

        expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it('should delete guide', async () => {
        const response = await request(app)
            .delete(`/guides/${createdGuideId}`)
            .send({ userId: 1 });

        expect(response.status).toBe(200);
        expect(response.body.message).toBeDefined();
    });

    it('should fail delete for non-existing guide', async () => {
        const response = await request(app)
            .delete('/guides/999999')
            .send({ userId: 1 });

        expect(response.status).toBeGreaterThanOrEqual(400);
    });
});
