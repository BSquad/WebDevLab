import express from 'express';
import cors from 'cors';
import { AuthController } from './controller/auth-controller.ts';
import { GameController } from './controller/game-controller.ts';
import { Db } from './db.ts';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const db = new Db();
await db.initDB();

const authController = new AuthController();
const gameController = new GameController();

app.get('/api/games', gameController.listGames);
app.post('/api/login', authController.login);
app.post('/api/register', authController.register);

app.listen(PORT, () => console.log(`Backend läuft auf http://localhost:${PORT}`));
