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

app.get('/api/users', async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fehler beim Laden der User' });
  }
});

app.get('/api/users/:name', async (req, res) => {
  try {
    const name = req.params.name;
    const user = await getUserByName(name);

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fehler beim Laden des Users' });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    await addUser(name, email, password);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fehler beim Anlegen des Users' });
  }
});

app.listen(PORT, () => console.log(`Backend läuft auf http://localhost:${PORT}`));
