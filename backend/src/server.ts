import express from 'express';
import cors from 'cors';
import { addUser, getUsers, getUserByName } from './user.ts';
import { getGames } from './game.ts';
import { createInitialData, setupDatabase } from './db.ts';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

await setupDatabase();
await createInitialData();

app.get('/api/games', async (req, res) => {
  try {
    const games = await getGames();
    res.json(games);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fehler beim Laden der Games' });
  }
});

app.post('/api/login', async (req, res) => {
  const { name, password } = req.body;
  const user = await getUserByName(name);

  if (!user || user.password !== password) {
    return res.status(401).json({ success: false });
  }

  res.json({ success: true });
});

app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, error: 'Fehlende Felder' });
  }

  await addUser(name, email, password);
  res.json({ success: true });
});

app.listen(PORT, () => console.log(`Backend läuft auf http://localhost:${PORT}`));
