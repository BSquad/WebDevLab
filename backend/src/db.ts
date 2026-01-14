import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';

async function openDB() {
  return await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });
}

async function setupDatabase() {
  const db = await openDB();

  await db.exec(`
    CREATE TABLE IF NOT EXISTS USER (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS GAME (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titel TEXT NOT NULL UNIQUE,
      genre TEXT,
      tags TEXT,
      achievementanzahl INTEGER DEFAULT 0,
      beschreibung TEXT,
      erscheinungsjahr INTEGER,
      plattform TEXT
    );
  `);

  await db.close();
}

async function createInitialData() {
  const db = await openDB();

  await db.exec(`
    INSERT OR IGNORE INTO USER (name, email, password) 
    VALUES 
    ('sa', 'sa@sa.de', 'sa');

    INSERT OR IGNORE INTO GAME (titel, genre, tags, achievementanzahl, beschreibung, erscheinungsjahr, plattform) 
    VALUES 
    ('The Legend of Zelda: Breath of the Wild', 'Action-Adventure', 'Open World, Exploration, Fantasy', 120, 'Ein Open-World-Abenteuer in der Welt von Hyrule.', 2017, 'Nintendo Switch, Wii U'),
    ('God of War', 'Action', 'Mythology, Combat, Story-Driven', 90, 'Ein episches Abenteuer in der Welt der nordischen Mythologie.', 2018, 'PlayStation 4');
  `);
}

export async function initDB() {
  await setupDatabase();
  await createInitialData();
}

export async function executeSQL(
  sql: string,
  params: any[] = [],
  single: boolean = false
): Promise<any> {
  const db: Database<sqlite3.Database, sqlite3.Statement> = await openDB();

  let result;
  
  try {
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      result = single ? await db.get(sql, params) : await db.all(sql, params);
    } else {
      result = await db.run(sql, params);
    }
  } catch (err) {
    console.error('SQL Fehler:', err);
    throw err;
  } finally {
    await db.close();
  }

  return result;
}