import { promises as fs } from 'fs';
import path from 'path';
import { Db } from './db.js';

const DB_PATH = path.join('./database.sqlite');

async function resetDatabase() {
    try {
        await fs.access(DB_PATH);
        await fs.unlink(DB_PATH);
        console.log('\x1b[32mDatenbank erfolgreich gelöscht.\x1b[0m');
    } catch (err: any) {
        if (err.code === 'ENOENT') {
        } else {
            console.log(
                '\x1b[31mLöschen fehlgeschlagen (Datei wird wahrscheinlich verwendet).\x1b[0m',
            );
        }
    }

    const db = new Db();
    await db.initDB();
    console.log('Datenbank neu initialisiert.');
}

resetDatabase().catch((err) => {
    console.error('Fehler beim Zurücksetzen der DB:', err);
});
