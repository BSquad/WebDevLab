import request from 'supertest';
import app from '../src/app.js'; // Adjust path if necessary

describe('Auth API Integration Tests', () => {
    const uniqueId = Date.now();
    const testUser = {
        name: `IntegrationUser_${uniqueId}`,
        email: `test${uniqueId}@example.com`,
        password: 'Password123!',
    };

    describe('POST /auth/register', () => {
        it('should successfully register a new user', async () => {
            const response = await request(app)
                .post('/auth/register')
                .send(testUser);

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('User registered successfully');
        });

        it('should reject registration with missing data', async () => {
            const response = await request(app)
                .post('/auth/register')
                .send({ name: 'OnlyName' }); // Missing email and password

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid registration data');
        });

        it('should throw 409 Conflict if email or username is taken', async () => {
            // Trying to register the exact same user again
            const response = await request(app)
                .post('/auth/register')
                .send(testUser);

            expect(response.status).toBe(409);
            expect(response.body.message).toMatch(/(taken|conflict)/i);
        });
    });

    describe('POST /auth/login', () => {
        it('should login successfully with correct credentials', async () => {
            const response = await request(app).post('/auth/login').send({
                name: testUser.name,
                password: testUser.password,
            });

            expect(response.status).toBe(200);
            expect(response.body.name).toBe(testUser.name);
            expect(response.body.id).toBeGreaterThan(0);
        });

        it('should reject login with wrong password', async () => {
            const response = await request(app).post('/auth/login').send({
                name: testUser.name,
                password: 'WrongPassword!',
            });

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Invalid username or password');
        });

        it('should reject login with invalid data types', async () => {
            const response = await request(app).post('/auth/login').send({
                name: 12345, // Not a string
                password: testUser.password,
            });

            expect(response.status).toBe(400);
        });
    });
});
