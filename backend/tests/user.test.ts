import request from 'supertest';
import app from '../src/app.js';

describe('User API Integration Tests', () => {
    let testUserId: number;
    const uniqueSuffix = Date.now();

    beforeAll(async () => {
        const testUser = {
            name: `UserTest_${uniqueSuffix}`,
            email: `user${uniqueSuffix}@test.com`,
            password: '1234',
        };

        await request(app).post('/auth/register').send(testUser);

        const loginRes = await request(app)
            .post('/auth/login')
            .send({ name: testUser.name, password: testUser.password });

        testUserId = loginRes.body.id;
    });

    describe('GET /users/:id', () => {
        it('should return user data for a valid ID', async () => {
            const response = await request(app).get(`/users/${testUserId}`);
            expect(response.status).toBe(200);
            expect(response.body.id).toBe(testUserId);
            expect(response.body.name).toContain('UserTest_');
        });

        it('should return 404 for non-existent user', async () => {
            const response = await request(app).get('/users/9999999');
            expect(response.status).toBe(404);
        });

        it('should return 400 for invalid ID format', async () => {
            const response = await request(app).get('/users/abc');
            expect(response.status).toBe(400);
        });
    });

    describe('PUT /users/:id', () => {
        it('should update user name and email', async () => {
            const response = await request(app)
                .put(`/users/${testUserId}`)
                .send({
                    name: 'UpdatedName',
                    email: `updated${uniqueSuffix}@test.com`,
                });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('User updated successfully');
        });

        it('should reject update if missing data', async () => {
            const response = await request(app)
                .put(`/users/${testUserId}`)
                .send({ name: 'OnlyName' });

            expect(response.status).toBe(400);
        });
    });

    describe('PUT /users/:id/layout', () => {
        it('should update the dashboard layout array', async () => {
            const response = await request(app)
                .put(`/users/${testUserId}/layout`)
                .send({ order: ['guides', 'analysis', 'games'] });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Layout updated successfully');
        });

        it('should reject layout update if order is not an array', async () => {
            const response = await request(app)
                .put(`/users/${testUserId}/layout`)
                .send({ order: 'guides, analysis' });

            expect(response.status).toBe(400);
        });
    });

    describe('GET User Relations (Profile, Games, Summary)', () => {
        it('should return the full user profile', async () => {
            const response = await request(app).get(
                `/users/${testUserId}/profile`,
            );
            expect(response.status).toBe(200);
            expect(response.body.games).toBeDefined();
        });

        it('should return the user summary', async () => {
            const response = await request(app).get(
                `/users/${testUserId}/summary`,
            );
            expect(response.status).toBe(200);
        });

        it('should return user games list', async () => {
            const response = await request(app).get(
                `/users/${testUserId}/games`,
            );
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });

        it('should return achievements', async () => {
            const res = await request(app).get(
                `/users/${testUserId}/achievements`,
            );
            expect(res.status).toBe(200);
        });

        it('should return guides', async () => {
            const res = await request(app).get(`/users/${testUserId}/guides`);
            expect(res.status).toBe(200);
        });
    });

    describe('POST /users/analysis', () => {
        it('should stream progress and complete the analysis', async () => {
            const response = await request(app)
                .post('/users/analysis')
                .send({ userId: testUserId });

            expect(response.status).toBe(200);
            expect(response.text).toContain('100');
        }, 15000);

        it('should handle analysis for non-existent user', async () => {
            const res = await request(app)
                .post('/users/analysis')
                .send({ userId: 9999999 });
            expect(res.status).toBe(200);
            expect(res.text).toContain('error');
        }, 15000);
    });

    describe('DELETE /users/:id', () => {
        it('should successfully delete the user', async () => {
            const response = await request(app).delete(`/users/${testUserId}`);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('User deleted successfully');
        });

        it('should return 404 when fetching a deleted user', async () => {
            const response = await request(app).get(`/users/${testUserId}`);
            expect(response.status).toBe(404);
        });
    });
});
