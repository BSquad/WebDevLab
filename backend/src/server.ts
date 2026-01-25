import express from 'express';
import cors from 'cors';
import { AuthController } from './controller/auth-controller.ts';
import { GameController } from './controller/game-controller.ts';
import { Db } from './db.ts';
import { GuideController } from './controller/guide-controller.ts';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const db = new Db();
await db.initDB();

const authController = new AuthController();
const gameController = new GameController();
const guideController = new GuideController();

app.post('/api/login', authController.login);
app.post('/api/register', authController.register);
app.get('/api/games', gameController.getGames);
app.get('/api/games/:id', gameController.getGameById);
app.post('/api/create-guide', guideController.createGuide);

app.listen(PORT, () => console.log(`Backend läuft auf http://localhost:${PORT}`));
