import express from 'express';
import cors from 'cors';
import { login, register } from './controller/auth-controller.ts';
import { listGames } from './controller/game-controller.ts';
import { initDB } from './db.ts';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

await initDB();

app.get('/api/games', listGames);
app.post('/api/login', login);
app.post('/api/register', register);

app.listen(PORT, () => console.log(`Backend läuft auf http://localhost:${PORT}`));
