import express from 'express';
import cors from 'cors';
import { addUser, getUserByEmail, getUsers } from './user.ts';
import { getGames } from './games.ts';
import { createInitialData } from './db.ts';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

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

app.post('/api/users', async (req, res) => {
  try {
    const { name, email, passwort } = req.body;
    await addUser(name, email, passwort);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fehler beim Anlegen des Users' });
  }
});

app.get('/api/users/email', async (req, res) => {
  try {
    const email = req.query.email as string;
    if (!email) {
      return res.status(400).json({ error: 'Email fehlt' });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User nicht gefunden' });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fehler beim Laden des Users' });
  }
});

app.listen(PORT, () => console.log(`Backend läuft auf http://localhost:${PORT}`));
