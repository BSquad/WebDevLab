import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';

export class Db {
  openDB = async () => {
    return await open({
      filename: './database.sqlite',
      driver: sqlite3.Database
    });
  }

  setupDatabase = async () => {
    const db = await this.openDB();

    await db.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      passwordHash TEXT NOT NULL,
      profilePicturePath TEXT
    );

    CREATE TABLE IF NOT EXISTS games (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL UNIQUE,
      description TEXT,
      genre TEXT,
      tags TEXT,
      platform TEXT,
      developer TEXT NOT NULL,
      publisher TEXT,
      releaseDate DATETIME NOT NULL,
      popularityScore FLOAT
    );

    CREATE TABLE IF NOT EXISTS achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      gameId INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      iconPath TEXT,
      FOREIGN KEY (gameId) REFERENCES games(id)
    );

    CREATE TABLE IF NOT EXISTS guides (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      authorId INTEGER NOT NULL,
      gameId INTEGER NOT NULL,
      title TEXT NOT NULL,
      content TEXT,
      pdfPath TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (authorId) REFERENCES users(id),
      FOREIGN KEY (gameId) REFERENCES games(id)
    );

    CREATE TABLE IF NOT EXISTS user_games (
      userId INTEGER NOT NULL,
      gameId INTEGER NOT NULL,
      isFavorite BOOLEAN,
      PRIMARY KEY (userId, gameId),
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (gameId) REFERENCES games(id)
    );

    CREATE TABLE IF NOT EXISTS user_achievements (
      userId INTEGER NOT NULL,
      achievementId INTEGER NOT NULL,
      completionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (userId, achievementId),
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (achievementId) REFERENCES achievements(id)
    );

    CREATE TABLE IF NOT EXISTS guide_rating (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      guideId INTEGER NOT NULL,
      score INTEGER,
      UNIQUE (userId, guideId),
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (guideId) REFERENCES guides(id)
    );

    CREATE TABLE IF NOT EXISTS guide_comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      guideId INTEGER NOT NULL,
      commentText TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (guideId) REFERENCES guides(id)
    );

    CREATE TABLE IF NOT EXISTS screenshots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      guideId INTEGER NOT NULL,
      filePath TEXT,
      FOREIGN KEY (guideId) REFERENCES guides(id)
    );
  `);

    await db.close();
  }

  createInitialData = async () => {
    const db = await this.openDB();

    await db.exec(`
    PRAGMA foreign_keys = ON;

    INSERT OR IGNORE INTO games
      (title, description, genre, tags, platform, developer, publisher, releaseDate, popularityScore)
    VALUES
      (
        'Elden Ring',
        'Open-World-Action-RPG in einer düsteren Fantasy-Welt.',
        'Action RPG',
        'soulslike,open world,fantasy',
        'PC,PS5,Xbox',
        'FromSoftware',
        'Bandai Namco',
        '2022-02-25',
        9.8
      ),
      (
        'The Witcher 3',
        'Storylastiges Rollenspiel rund um Geralt von Riva.',
        'RPG',
        'story,open world,fantasy',
        'PC,PS5,Xbox',
        'CD Projekt Red',
        'CD Projekt',
        '2015-05-19',
        9.7
      ),
      (
        'Stardew Valley',
        'Entspannendes Farming- und Lebenssimulationsspiel.',
        'Simulation',
        'farming,indie,relaxing',
        'PC,Switch,PS',
        'ConcernedApe',
        'ConcernedApe',
        '2016-02-26',
        9.2
      ),
      (
        'Hades',
        'Roguelike-Actionspiel mit starkem Fokus auf Story und Gameplay.',
        'Roguelike',
        'roguelike,action,indie',
        'PC,Switch,PS,Xbox',
        'Supergiant Games',
        'Supergiant Games',
        '2020-09-17',
        9.4
      ),
      (
        'Minecraft',
        'Sandbox-Spiel mit Fokus auf Kreativität und Exploration.',
        'Sandbox',
        'building,survival,creative',
        'PC,Mobile,Console',
        'Mojang',
        'Microsoft',
        '2011-11-18',
        9.5
      );

    INSERT OR IGNORE INTO achievements
      (gameId, title, description, iconPath)
    VALUES
      (
        (SELECT id FROM games WHERE title = 'Elden Ring'),
        'Elden Lord',
        'Beende das Spiel und werde Elden Lord.',
        'TODO'
      ),
      (
        (SELECT id FROM games WHERE title = 'Elden Ring'),
        'Legendärer Krieger',
        'Besiege 50 optionale Bosse.',
        'TODO'
      ),
      (
        (SELECT id FROM games WHERE title = 'Elden Ring'),
        'Runenmeister',
        'Sammle insgesamt 1.000.000 Runen.',
        'TODO'
      ),
      (
        (SELECT id FROM games WHERE title = 'The Witcher 3'),
        'Hexer auf dem Pfad',
        'Schließe die Hauptstory ab.',
        'TODO'
      ),
      (
        (SELECT id FROM games WHERE title = 'The Witcher 3'),
        'Gwent-Meister',
        'Gewinne alle wichtigen Gwent-Turniere.',
        'TODO'
      ),
      (
        (SELECT id FROM games WHERE title = 'The Witcher 3'),
        'Monsterjäger',
        'Töte 100 Monster.',
        'TODO'
      ),
      (
        (SELECT id FROM games WHERE title = 'Stardew Valley'),
        'Erster Ertrag',
        'Ernte deine erste Feldfrucht.',
        'TODO'
      ),
      (
        (SELECT id FROM games WHERE title = 'Stardew Valley'),
        'Gemeinschaftsheld',
        'Schließe das Community Center ab.',
        'TODO'
      ),
      (
        (SELECT id FROM games WHERE title = 'Stardew Valley'),
        'Millionär',
        'Verdiene insgesamt 1.000.000 Gold.',
        'TODO'
      ),
      (
        (SELECT id FROM games WHERE title = 'Hades'),
        'Fluchtversuch',
        'Erreiche die Oberfläche zum ersten Mal.',
        'TODO'
      ),
      (
        (SELECT id FROM games WHERE title = 'Hades'),
        'Gott des Todes',
        'Beende das Spiel vollständig.',
        'TODO'
      ),
      (
        (SELECT id FROM games WHERE title = 'Hades'),
        'Olympischer Segen',
        'Erhalte Segen aller olympischen Götter.',
        'TODO'
      ),

      /* Minecraft */
      (
        (SELECT id FROM games WHERE title = 'Minecraft'),
        'Holz sammeln',
        'Schlage deinen ersten Baum.',
        'TODO'
      ),
      (
        (SELECT id FROM games WHERE title = 'Minecraft'),
        'Der End',
        'Besiege den Enderdrachen.',
        'TODO'
      ),
      (
        (SELECT id FROM games WHERE title = 'Minecraft'),
        'Redstone-Ingenieur',
        'Baue eine komplexe Redstone-Maschine.',
        'TODO'
      );
  `);
  }

  initDB = async () => {
    await this.setupDatabase();
    await this.createInitialData();
  }

  executeSQL = async (
    sql: string,
    params: any[] = [],
    single: boolean = false
  ): Promise<any> => {
    const db: Database<sqlite3.Database, sqlite3.Statement> = await this.openDB();

    await db.exec(`PRAGMA foreign_keys = ON;`);

    let result;

    try {
      if (sql.trim().toUpperCase().startsWith('SELECT')) {
        result = single ? await db.get(sql, params) : await db.all(sql, params);
      } else {
        result = await db.run(sql, params);
      }
    } catch (err) {
      throw err;
    } finally {
      await db.close();
    }

    return result;
  }
}