// server.ts

import express from 'express';
import type { ErrorRequestHandler } from 'express';
import cors from 'cors';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import createError from 'http-errors';

import { Db } from './db.js';
import { authRouter } from './routes/auth-routes.js';
import { gameRouter } from './routes/game-routes.js';
import { guideRouter } from './routes/guide-routes.js';
import { userRouter } from './routes/user-routes.js';
import { favoritesRouter } from './routes/favorites-routes.js';
import { commentsRouter } from './routes/comments-routes.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const db = new Db();
await db.initDB();

app.use('/auth', authRouter);
app.use('/games', gameRouter);
app.use('/guides', guideRouter);
app.use('/users', userRouter);
app.use('/comments', commentsRouter);
app.use('/favorites', favoritesRouter);

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.error(`[Error] ${req.method} ${req.originalUrl}`);
    console.error(err.stack ?? err);

    const isDev = process.env.NODE_ENV === 'development';

    // throw 500 if there is no status code
    const statusCode = err.status || 500;

    // only return the error message for non-500 error
    const safeMessage = err.expose
        ? err.message
        : 'Internal Server Error. Please try again later.';

    res.status(statusCode).json({
        message: safeMessage,
        ...(isDev && { stack: err.stack }),
    });
};

//catch if the route doesn't exist
app.use((req, res, next) => {
    next(createError(404, `Route not found: ${req.method} ${req.originalUrl}`));
});

app.use(errorHandler);

export default app;
