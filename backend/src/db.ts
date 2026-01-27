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
      description TEXT NOT NULL,
      genre TEXT NOT NULL,
      tags TEXT NOT NULL,
      platform TEXT NOT NULL,
      developer TEXT NOT NULL,
      publisher TEXT NOT NULL,
      releaseDate DATETIME NOT NULL,
      imageName TEXT,
      popularityScore FLOAT
    );

    CREATE TABLE IF NOT EXISTS achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      gameId INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      iconPath TEXT,
      FOREIGN KEY (gameId) REFERENCES games(id),
      UNIQUE(gameId, title)
    );

    CREATE TABLE IF NOT EXISTS guides (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      authorId INTEGER NOT NULL,
      gameId INTEGER NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      pdfPath TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (authorId) REFERENCES users(id),
      FOREIGN KEY (gameId) REFERENCES games(id),
      UNIQUE(authorId, gameId, title)
    );

    CREATE TABLE IF NOT EXISTS user_games (
      userId INTEGER NOT NULL,
      gameId INTEGER NOT NULL,
      isFavorite BOOLEAN,
      PRIMARY KEY (userId, gameId),
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (gameId) REFERENCES games(id),
      UNIQUE (userId, gameId)
    );

    CREATE TABLE IF NOT EXISTS user_achievements (
      userId INTEGER NOT NULL,
      achievementId INTEGER NOT NULL,
      completedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (userId, achievementId),
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (achievementId) REFERENCES achievements(id),
      UNIQUE (userId, achievementId)
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
      FOREIGN KEY (guideId) REFERENCES guides(id),
      UNIQUE (userId, guideId, commentText)
    );

    CREATE TABLE IF NOT EXISTS screenshots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      guideId INTEGER NOT NULL,
      filePath TEXT,
      FOREIGN KEY (guideId) REFERENCES guides(id),
      UNIQUE (guideId, filePath)
    );
  `);

    await db.close();
  }

  createInitialData = async () => {
    const db = await this.openDB();

    await db.exec(`
    PRAGMA foreign_keys = ON;

    INSERT OR IGNORE INTO games
      (title, description, genre, tags, platform, developer, publisher, releaseDate, imageName, popularityScore)
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
        'EldenRing.jpg',
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
        'TheWitcher3.jpg',
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
        'StardewValley.jpg',
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
        'Hades.webp',
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
        'Minecraft.jpg',
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

    INSERT OR IGNORE INTO users
      (name, email, passwordHash, profilePicturePath)
    VALUES
      (
        'sa',
        'sa@test.de',
        '4cf6829aa93728e8f3c97df913fb1bfa95fe5810e2933a05943f8312a98d9cf2', --sa
        'TODO'
      ),
      (
        'test',
        'test@test.de',
        '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', --test
        'TODO'
      );

    INSERT OR IGNORE INTO guides 
      (authorId, gameId, title, content, pdfPath, createdAt)
    VALUES
      (
        (SELECT id FROM users WHERE name = 'sa'), 
        (SELECT id FROM games WHERE title = 'Elden Ring'), 
        'Beginner Guide', 
        'Elden Ring ist ein riesiges Open-World-Action-RPG. In diesem Guide behandeln wir die grundlegenden Spielmechaniken, wie das Bewegen, Kämpfen und Leveln. Außerdem geben wir Tipps für die ersten Gebiete, wie man Ressourcen effizient nutzt, erste Bosse besiegt und Fallen vermeidet. Spieler lernen, welche Klassen für den Einstieg geeignet sind, wie man die Karte optimal erkundet und welche NPCs hilfreich sind. Der Guide geht auch auf Waffen, Magie und Buffs ein, damit Anfänger nicht frustriert werden.', 
        'TODO', 
        datetime('now')
      ),
      (
        (SELECT id FROM users WHERE name = 'test'), 
        (SELECT id FROM games WHERE title = 'Elden Ring'), 
        'Boss Guide', 
        'Dieser Guide konzentriert sich auf die großen Bosskämpfe in Elden Ring. Wir geben Schritt-für-Schritt-Anleitungen für die Taktiken gegen die wichtigsten Bosse der ersten Spielregionen. Dabei werden Angriffsmuster, Schwächen und empfohlene Ausrüstung beschrieben. Außerdem Tipps zu Summons, Coop-Mechaniken und wie man Bosskampffrust reduziert, damit der Fortschritt flüssig bleibt.', 
        'TODO', 
        datetime('now')
      ),
      (
        (SELECT id FROM users WHERE name = 'sa'), 
        (SELECT id FROM games WHERE title = 'Elden Ring'), 
        'Secrets & Easter Eggs', 
        'Dieser Guide deckt geheime Orte, versteckte Bosse und seltene Items in Elden Ring ab. Wir zeigen, wie man versteckte Pfade entdeckt, welche NPC-Quests zu besonderen Belohnungen führen, und wie man geheime Skills und Waffen freischaltet. Außerdem Hinweise zu Easter Eggs, die Anspielungen auf andere Spiele enthalten. Spieler erhalten hier wertvolle Hinweise, um das Spiel vollständig zu erkunden.', 
        'TODO', 
        datetime('now')
      ),
      (
        (SELECT id FROM users WHERE name = 'sa'), 
        (SELECT id FROM games WHERE title = 'The Witcher 3'), 
        'Main Story Walkthrough', 
        'Dieser Guide behandelt die Hauptquests von The Witcher 3: Wild Hunt. Wir führen den Spieler durch alle Kapitel und zeigen, wie man Entscheidungen trifft, die Einfluss auf das Spielende haben. Dazu Tipps zu Kämpfen, Hexer-Zeichen, Tränken und Ausrüstung. Außerdem behandeln wir die wichtigsten Story-Entscheidungen, um die maximale Erfahrung und bestmögliche Belohnungen zu erhalten.', 
        'TODO', 
        datetime('now')
      ),
      (
        (SELECT id FROM users WHERE name = 'sa'), 
        (SELECT id FROM games WHERE title = 'The Witcher 3'), 
        'Gwent Strategy Guide', 
        'Ein umfassender Guide zum Kartenspiel Gwent in The Witcher 3. Hier erfährt man, wie man die besten Decks zusammenstellt, Gegner analysiert und Karten effizient sammelt. Wir erklären die Spielmechanik, Strategien gegen spezielle Gegner und geben Tipps für Turniere in Novigrad und Kaer Morhen.', 
        'TODO', 
        datetime('now')
      ),
      (
        (SELECT id FROM users WHERE name = 'test'), 
        (SELECT id FROM games WHERE title = 'Hades'), 
        'Beginner Hades Guide', 
        'Hades ist ein roguelike Dungeon-Crawler. In diesem Guide erfahren Anfänger, wie man die ersten Runs überlebt, welche Waffen sich für den Einstieg eignen, wie man die Götterboons sinnvoll kombiniert und welche Upgrades langfristig helfen. Außerdem Tipps zu Heilung, Gegnergruppen und Bossen in den ersten Leveln. Ziel ist es, den Spieler optimal auf spätere, schwierigere Runs vorzubereiten.', 
        'TODO', 
        datetime('now')
      ),
      (
        (SELECT id FROM users WHERE name = 'test'), 
        (SELECT id FROM games WHERE title = 'Hades'), 
        'Advanced Hades Tactics', 
        'Dieser Guide richtet sich an erfahrene Spieler von Hades. Wir analysieren die fortgeschrittenen Builds, synergistische Boons, die optimalen Waffen und die beste Strategie gegen die finalen Bosse. Außerdem geben wir Hinweise zu seltenen Upgrades, Chamber-Kompositionen und Geheimnissen in der Unterwelt, um maximale Highscores zu erreichen.', 
        'TODO', 
        datetime('now')
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