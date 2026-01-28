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
      gameId INTEGER NOT NULL,
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
      ('Elden Ring','Open-World-Action-RPG in einer düsteren Fantasy-Welt.','action rpg','soulslike,open-world,fantasy','PC,PS5,Xbox','FromSoftware','Bandai Namco','2022-02-25','EldenRing.jpg',9.8),
      ('The Witcher 3','Storylastiges Rollenspiel rund um Geralt von Riva.','rpg','story,open-world,fantasy','PC,PS5,Xbox','CD Projekt Red','CD Projekt','2015-05-19','TheWitcher3.jpg',9.7),
      ('Stardew Valley','Entspannendes Farming- und Lebenssimulationsspiel.','simulation','farming,indie,relaxing','PC,Switch,PS','ConcernedApe','ConcernedApe','2016-02-26','StardewValley.jpg',9.2),
      ('Hades','Roguelike-Actionspiel mit starkem Fokus auf Story und Gameplay.','roguelike','roguelike,action,indie','PC,Switch,PS,Xbox','Supergiant Games','Supergiant Games','2020-09-17','Hades.webp',9.4),
      ('Minecraft','Sandbox-Spiel mit Fokus auf Kreativität und Exploration.','sandbox','building,survival,creative','PC,Mobile,Console','Mojang','Microsoft','2011-11-18','Minecraft.jpg',9.5),
      ('Cyberpunk 2077', 'Futuristisches Open-World-RPG in Night City.', 'rpg', 'open-world,story,shooter', 'PC,PS5,Xbox', 'CD Projekt Red', 'CD Projekt', '2020-12-10', '', 8.2),
      ('God of War', 'Action-Adventure rund um Kratos und seinen Sohn Atreus.', 'action adventure', 'mythology,story,action', 'PS4,PS5', 'Santa Monica Studio', 'Sony', '2018-04-20', '', 9.6),
      ('Assassin''s Creed Valhalla', 'Open-World-Actionspiel in der Wikingerzeit.', 'action rpg', 'open-world,story', 'PC,PS5,Xbox', 'Ubisoft Montreal', 'Ubisoft', '2020-11-10', '', 8.5),
      ('Hollow Knight', 'Metroidvania-Spiel in einer düsteren Welt voller Insekten.', 'metroidvania', 'indie,platformer,adventure', 'PC,Switch,PS', 'Team Cherry', 'Team Cherry', '2017-02-24', '', 9.3),
      ('Celeste', 'Plattformspiel über eine schwierige Bergbesteigung.', 'platformer', 'indie,story', 'PC,Switch,PS,Xbox', 'Matt Makes Games', 'Matt Makes Games', '2018-01-25', '', 9.0),
      ('The Legend of Zelda: Breath of the Wild', 'Open-World-Abenteuer in Hyrule.', 'adventure', 'open-world,exploration,fantasy', 'Switch', 'Nintendo EPD', 'Nintendo', '2017-03-03', '', 9.8),
      ('Super Mario Odyssey', '3D-Plattform-Abenteuer rund um Mario.', 'platformer', 'platformer,adventure', 'Switch', 'Nintendo EPD', 'Nintendo', '2017-10-27', '', 9.6),
      ('Doom Eternal', 'Fast-paced First-Person-Shooter gegen Dämonen.', 'fps', 'action,shooter,demons', 'PC,PS5,Xbox', 'id Software', 'Bethesda', '2020-03-20', '', 9.1),
      ('Resident Evil Village', 'Survival-Horror in einem mysteriösen Dorf.', 'horror', 'survival,horror,story', 'PC,PS5,Xbox', 'Capcom', 'Capcom', '2021-05-07', '', 8.9),
      ('Fortnite', 'Battle Royale Shooter mit Bauelementen.', 'shooter', 'battle-royale,multiplayer', 'PC,PS5,Xbox,Mobile', 'Epic Games', 'Epic Games', '2017-07-21', '', 8.0),
      ('League of Legends', 'MOBA-Spiel mit strategischen Kämpfen.', 'moba', 'strategy,multiplayer,competitive', 'PC', 'Riot Games', 'Riot Games', '2009-10-27', '', 9.0),
      ('Valorant', 'Taktischer 5v5 Shooter.', 'fps', 'shooter,multiplayer,competitive', 'PC', 'Riot Games', 'Riot Games', '2020-06-02', '', 8.7),
      ('Animal Crossing: New Horizons', 'Lebenssimulation auf einer Insel.', 'simulation', 'relaxing', 'Switch', 'Nintendo EPD', 'Nintendo', '2020-03-20', '', 9.2),
      ('Final Fantasy VII Remake', 'Action-RPG in der Welt von Midgar.', 'rpg', 'story,action,fantasy', 'PS4,PS5', 'Square Enix', 'Square Enix', '2020-04-10', '', 9.3),
      ('Monster Hunter: World', 'Action-RPG mit großen Monstern und Teamplay.', 'action rpg', 'action,rpg,coop', 'PC,PS4,Xbox', 'Capcom', 'Capcom', '2018-01-26', '', 9.1),
      ('Destiny','First-Person-Shooter mit MMO-Elementen, epischen Raids und kooperativen Missionen in einer futuristischen Welt.','fps mmo','shooter,coop,space,action','PC,PS5,Xbox','Bungie','Bungie','2014-09-09','',9.1),
      ('Teamfight Tactics','Autobattler-Spiel im League of Legends-Universum, strategisches Platzieren von Champions und Items.','strategy','autobattler,strategy,tactics,turn-based','PC','Riot Games','Riot Games','2019-06-26','',8.5),
      ('Overwatch','Team-basierter Multiplayer-Shooter mit einzigartigen Heldenfähigkeiten und schneller Action.','fps','shooter,multiplayer,team-based,competitive','PC,PS5,Xbox,Switch','Blizzard Entertainment','Blizzard Entertainment','2016-05-24','',9.0),
      ('Starcraft 2','Strategie-Echtzeitspiel mit drei einzigartigen Rassen, epischer Kampagne und kompetitivem Multiplayer.','rts','strategy,real-time,space,competitive,story','PC','Blizzard Entertainment','Blizzard Entertainment','2010-07-27','',9.3),
      ('Hearthstone','Digitales Kartenspiel basierend auf dem Warcraft-Universum, strategisches Deckbuilding und Online-Kämpfe.','card game','card-game,warcraft,strategy,collectible','PC,Mobile,Mac','Blizzard Entertainment','Blizzard Entertainment','2014-03-11','',8.7),
      ('Paladins','Hero-Shooter mit verschiedenen Klassen, kooperativen Missionen und kompetitivem Spielmodus.','fps hero shooter','shooter,hero,team-based,action','PC,PS5,Xbox,Switch','Hi-Rez Studios','Hi-Rez Studios','2016-09-16','',8.4),
      ('Factorio','Industrielles Aufbauspiel, Fabriken bauen, Ressourcen automatisieren und Produktionsketten optimieren.','simulation strategy','simulation,strategy,management','PC','Wube Software','Wube Software','2020-08-14','',9.0),
      ('RimWorld','Kolonie-Simulation auf einem fremden Planeten, Überleben, Charaktermanagement und Storytelling.','simulation','management,simulation,indie,survival','PC','Ludeon Studios','Ludeon Studios','2018-10-17','',9.1),
      ('Rainbow Six Siege','Taktischer Multiplayer-Shooter, Zerstörung der Umgebung und Teamplay im Fokus.','fps tactical','shooter,tactical,multiplayer,competitive,team','PC,PS5,Xbox','Ubisoft','Ubisoft','2015-12-01','',9.0),
      ('World of Warships','Online-PvP-Seeschlachten, Schiffsklassen, Strategie und taktisches Gameplay.','naval combat','strategy,multiplayer','PC','Wargaming','Wargaming','2015-09-17','',8.6),
      ('For Honor','Nahkampf-Actionspiel mit mittelalterlichen Kriegern, Multiplayer- und Einzelspieler-Modi.','action fighting','action,medieval,multiplayer','PC,PS5,Xbox','Ubisoft','Ubisoft','2017-02-14','',8.7),
      ('Far Cry 2','Open-World-Actionspiel in Afrika, realistische Schadensmechanik und dynamische Story.','fps open-world','shooter,open-world,action,story,adventure','PC,PS4,Xbox','Ubisoft','Ubisoft','2008-10-21','',8.3),
      ('Far Cry 3','Open-World-Actionspiel mit Inselsetting, Crafting, Story-Entscheidungen und Stealth-Elementen.','fps open-world','shooter,open-world,action,story','PC,PS4,Xbox','Ubisoft','Ubisoft','2012-11-29','',9.0),
      ('Far Cry 4','Open-World-Actionspiel in den Himalaya-Bergen, Erkundung, Quests und Waffenvielfalt.','fps open-world','shooter,open-world,action,exploration,story','PC,PS4,Xbox','Ubisoft','Ubisoft','2014-11-18','',8.9),
      ('Far Cry 5','Open-World-Shooter in Montana, USA, Storymissionen, Multiplayer und Koop-Modus.','fps open-world','shooter,open-world,action,story','PC,PS4,Xbox','Ubisoft','Ubisoft','2018-03-27','',8.8),
      ('Far Cry 6','Open-World-Actionspiel in fiktivem tropischen Setting, Story, Missionen und Fahrzeuge.','fps open-world','shooter,open-world,action,story','PC,PS5,Xbox','Ubisoft','Ubisoft','2021-10-07','',8.7),
      ('Battlefield 3','First-Person-Shooter mit großen Multiplayer-Schlachten, Fahrzeugen und realistischem Gameplay.','fps','shooter,multiplayer,action','PC,PS4,Xbox','DICE','Electronic Arts','2011-10-25','',9.0),
      ('Battlefield 4','Multiplayer-Shooter mit dynamischen Karten, Teamplay und realistischem Schadensmodell.','fps','shooter,multiplayer,action,team','PC,PS4,Xbox','DICE','Electronic Arts','2013-10-29','',8.8),
      ('Call of Duty: Modern Warfare','Moderne Militär-Shooter-Serie mit Einzelspieler-Kampagne und Multiplayer-Modi.','fps','shooter,action,competitive','PC,PS4,Xbox','Infinity Ward','Activision','2019-10-25','',9.2),
      ('God of War (2018)','Action-Adventure-Spiel mit nordischer Mythologie, epischer Story und Kämpfen.','action adventure','action,adventure,mythology,story','PC,PS4','Santa Monica Studio','Sony','2018-04-20','',9.5),
      ('Horizon Zero Dawn','Open-World-Action-RPG mit Roboterdinosauriern, Crafting und Story-Entscheidungen.','action rpg','action,rpg,open-world,story','PC,PS4','Guerrilla Games','Sony','2017-02-28','',9.1),
      ('Horizon Forbidden West','Fortsetzung von Horizon Zero Dawn, neue Welt, Story, Kampf gegen Maschinen und Erkundung.','action rpg','action,rpg,open-world,story,adventure','PC,PS5','Guerrilla Games','Sony','2022-02-18','',9.3),
      ('Clair Obscur: Expedition 33', 'Clair Obscur: Expedition 33 ist ein preisgekröntes, von der Kritik gefeiertes Rollenspiel aus dem Jahr 2025, entwickelt von dem französischen Studio Sandfall Interactive und veröffentlicht von Kepler Interactive. Das Spiel kombiniert eine tiefgründige narrative Struktur mit taktischen rundenbasierten Kämpfen, kunstvoller Belle‑Époque‑inspirierten Weltgestaltung und emotional aufgeladenen Charakterbögen. Spieler begleiten eine Expedition gegen eine mysteriöse, übernatürliche Bedrohung in einer eindrucksvoll gestalteten Fantasy‑Welt, in der Licht‑ und Schattenmotivik als zentrales künstlerisches Thema dient. Clair Obscur erhielt zahlreiche Auszeichnungen, darunter Game of the Year 2025 bei den The Game Awards, Best Narrative, Best Art Direction und Best Score und wurde von Kritikern und Spielern für seine Story, Musik und visuelle Gestaltung gelobt. Das Spiel wurde am 24. April 2025 für PlayStation 5, Windows und Xbox Series X/S veröffentlicht und verkaufte bis Ende 2025 über fünf Millionen Einheiten.', 'role-playing', 'rpg,story,turn-based,fantasy', 'PC,PS5,Xbox', 'Sandfall Interactive', 'Kepler Interactive', '2025-04-24', '', 9.8);

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