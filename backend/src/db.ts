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
      (1, 'Elden Lord', 'Beende das Spiel und werde Elden Lord.', '/icons/elden_lord.png'),
      (1, 'Legendärer Krieger', 'Besiege 50 optionale Bosse.', '/icons/legendary_warrior.png'),
      (1, 'Runenmeister', 'Sammle insgesamt 1.000.000 Runen.', '/icons/rune_master.png'),

      (2, 'Hexer auf dem Pfad', 'Schließe die Hauptstory ab.', '/icons/witcher_path.png'),
      (2, 'Gwent-Meister', 'Gewinne alle wichtigen Gwent-Turniere.', '/icons/gwent_master.png'),
      (2, 'Monsterjäger', 'Töte 100 Monster.', '/icons/monster_hunter.png'),

      (3, 'Erster Ertrag', 'Ernte deine erste Feldfrucht.', '/icons/first_harvest.png'),
      (3, 'Gemeinschaftsheld', 'Schließe das Community Center ab.', '/icons/community_hero.png'),
      (3, 'Millionär', 'Verdiene insgesamt 1.000.000 Gold.', '/icons/millionaire.png'),

      (4, 'Fluchtversuch', 'Erreiche die Oberfläche zum ersten Mal.', '/icons/escape_attempt.png'),
      (4, 'Gott des Todes', 'Beende das Spiel vollständig.', '/icons/god_of_dead.png'),
      (4, 'Olympischer Segen', 'Erhalte Segen aller olympischen Götter.', '/icons/olympian_blessing.png'),

      (5, 'Holz sammeln', 'Schlage deinen ersten Baum.', '/icons/chop_wood.png'),
      (5, 'Der End', 'Besiege den Enderdrachen.', '/icons/the_end.png'),
      (5, 'Redstone-Ingenieur', 'Baue eine komplexe Redstone-Maschine.', '/icons/redstone_engineer.png');
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