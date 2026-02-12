import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';

export class Db {
    openDB = async () => {
        return await open({
            filename: './database.sqlite',
            driver: sqlite3.Database,
        });
    };

    initDB = async () => {
        await this.setupDatabase();
        await this.createInitialData();
    };

    executeSQL = async (
        sql: string,
        params: any[] = [],
        single: boolean = false,
    ): Promise<any> => {
        const db: Database<sqlite3.Database, sqlite3.Statement> =
            await this.openDB();

        await db.exec(`PRAGMA foreign_keys = ON;`);

        let result;

        try {
            if (sql.trim().toUpperCase().startsWith('SELECT')) {
                result = single
                    ? await db.get(sql, params)
                    : await db.all(sql, params);
            } else {
                result = await db.run(sql, params);
            }
        } catch (err) {
            throw err;
        } finally {
            await db.close();
        }

        return result;
    };

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
          difficulty TEXT NOT NULL CHECK(difficulty IN ('bronze', 'silver', 'gold', 'platinum')),
          FOREIGN KEY (gameId) REFERENCES games(id),
          UNIQUE(gameId, title)
        );

        CREATE TABLE IF NOT EXISTS guides (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER NOT NULL,
          gameId INTEGER NOT NULL,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          pdfPath TEXT,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users(id),
          FOREIGN KEY (gameId) REFERENCES games(id),
          UNIQUE(userId, gameId, title)
        );

        CREATE TABLE IF NOT EXISTS user_games (
          userId INTEGER NOT NULL,
          gameId INTEGER NOT NULL,
          isFavorite BOOLEAN,
          addedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
    };

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
            (gameId, title, description, difficulty)
          VALUES
            (
              (SELECT id FROM games WHERE title = 'Elden Ring'),
              'Elden Lord',
              'End the game and become the Elden Lord.',
              'silver'
            ),
            (
              (SELECT id FROM games WHERE title = 'Elden Ring'),
              'Legendary Warrior',
              'Kill 50 optional bosses.',
              'gold'
            ),
            (
              (SELECT id FROM games WHERE title = 'Elden Ring'),
              'Rune Collector',
              'Collect 1.000.000 runes.',
              'platinum'
            ),
            (
              (SELECT id FROM games WHERE title = 'The Witcher 3'),
              'The Witcher',
              'Complete all main story quests.',
              'bronze'
            ),
            (
              (SELECT id FROM games WHERE title = 'The Witcher 3'),
              'Gwent-Master',
              'Win all important Gwent tournaments.',
              'platinum'
            ),
            (
              (SELECT id FROM games WHERE title = 'The Witcher 3'),
              'Monster Slayer',
              'Kill 100 monsters.',
              'bronze'
            ),
            (
              (SELECT id FROM games WHERE title = 'The Witcher 3'),
              'Card Collector',
              'Collect all Gwent cards.',
              'silver'
            ),
            (
              (SELECT id FROM games WHERE title = 'The Witcher 3'),
              'Master Alchemist',
              'Create 20 different alchemical potions.',
              'silver'
            ),
            (
              (SELECT id FROM games WHERE title = 'The Witcher 3'),
              'Swordsman',
              'Reach level 25 in sword skills.',
              'gold'
            ),
            (
              (SELECT id FROM games WHERE title = 'The Witcher 3'),
              'Explorer',
              'Discover all question mark locations in Velen.',
              'bronze'
            ),
            (
              (SELECT id FROM games WHERE title = 'The Witcher 3'),
              'Treasure Hunter',
              'Find and open 50 treasure chests.',
              'bronze'
            ),
            (
              (SELECT id FROM games WHERE title = 'The Witcher 3'),
              'Friend of the Dwarves',
              'Complete all quests for Zoltan.',
              'silver'
            ),
            (
              (SELECT id FROM games WHERE title = 'The Witcher 3'),
              'Lover',
              'Complete all romance quests.',
              'silver'
            ),
            (
              (SELECT id FROM games WHERE title = 'The Witcher 3'),
              'Monster Hunter Pro',
              'Complete 25 witcher contracts.',
              'gold'
            ),
            (
              (SELECT id FROM games WHERE title = 'The Witcher 3'),
              'Skellige Champion',
              'Complete all main quests in Skellige.',
              'silver'
            ),
            (
              (SELECT id FROM games WHERE title = 'The Witcher 3'),
              'Novigrad Socialite',
              'Complete all secondary quests in Novigrad.',
              'silver'
            ),
            (
              (SELECT id FROM games WHERE title = 'The Witcher 3'),
              'Sign Master',
              'Reach level 20 in all sign skills.',
              'gold'
            ),
            (
              (SELECT id FROM games WHERE title = 'The Witcher 3'),
              'Mutagen Collector',
              'Create and equip 3 greater mutagens.',
              'silver'
            ),
            (
              (SELECT id FROM games WHERE title = 'The Witcher 3'),
              'Horse Master',
              'Win 25 horse races.',
              'bronze'
            ),
            (
              (SELECT id FROM games WHERE title = 'The Witcher 3'),
              'Fist Fighter',
              'Win all fist fighting tournaments.',
              'silver'
            ),
            (
              (SELECT id FROM games WHERE title = 'The Witcher 3'),
              'Diplomat',
              'Resolve 5 quests through dialogue.',
              'bronze'
            ),
            (
              (SELECT id FROM games WHERE title = 'The Witcher 3'),
              'Rich Man',
              'Accumulate 50,000 crowns.',
              'gold'
            ),
            (
              (SELECT id FROM games WHERE title = 'The Witcher 3'),
              'Completionist',
              'Complete all quests in the game.',
              'platinum'
            ),
            (
              (SELECT id FROM games WHERE title = 'The Witcher 3'),
              'Wild Hunt Slayer',
              'Defeat the Wild Hunt leader.',
              'gold'
            ),
            (
              (SELECT id FROM games WHERE title = 'Stardew Valley'),
              'First Harvest',
              'Harvest your first crop.',
              'bronze'
            ),
            (
              (SELECT id FROM games WHERE title = 'Stardew Valley'),
              'Community Helper',
              'Complete the Community Center.',
              'silver'
            ),
            (
              (SELECT id FROM games WHERE title = 'Stardew Valley'),
              'Farming Pro',
              'Reach level 10 in Farming skill.',
              'gold'
            ),
            (
              (SELECT id FROM games WHERE title = 'Stardew Valley'),
              'Millionaire',
              'Earn 1,000,000 gold.',
              'platinum'
            ),
            (
              (SELECT id FROM games WHERE title = 'Hades'),
              'Escape Artist',
              'Escape the Underworld for the first time.',
              'bronze'
            ),
            (
              (SELECT id FROM games WHERE title = 'Hades'),
              'Godslayer',
              'End the game completely.',
              'gold'
            ),
            (
              (SELECT id FROM games WHERE title = 'Hades'),
              'olympian Favor',
              'Receive blessings from all Olympian gods.',
              'platinum'
            ),
            (
              (SELECT id FROM games WHERE title = 'Minecraft'),
              'Woodworker',
              'Collect your first block of wood.',
              'bronze'
            ),
            (
              (SELECT id FROM games WHERE title = 'Minecraft'),
              'The End',
              'Defeat the Ender Dragon.',
              'platinum'
            ),
            (
              (SELECT id FROM games WHERE title = 'Minecraft'),
              'Redstone-Engineer',
              'Build a complex Redstone machine.',
              'silver'
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
            (userId, gameId, title, content, pdfPath, createdAt)
          VALUES
            (
              (SELECT id FROM users WHERE name = 'sa'), 
              (SELECT id FROM games WHERE title = 'Elden Ring'), 
              'Beginner Guide', 
              'Elden Ring is a massive open-world action RPG. This guide covers the basic game mechanics including movement, combat, and leveling. We also provide tips for the first areas, how to use resources efficiently, defeat early bosses, and avoid traps. Players will learn which classes are suitable for beginners, how to explore the map optimally, and which NPCs are helpful. The guide also covers weapons, magic, and buffs to prevent frustration for new players.', 
              'TODO', 
              '2026-01-15 14:30:00'
            ),
            (
              (SELECT id FROM users WHERE name = 'test'), 
              (SELECT id FROM games WHERE title = 'Elden Ring'), 
              'Boss Guide', 
              'This guide focuses on the major boss fights in Elden Ring. We provide step-by-step instructions for tactics against the most important bosses in the early game regions. This includes attack patterns, weaknesses, and recommended equipment. Additionally, tips for summons, co-op mechanics, and how to reduce boss fight frustration to ensure smooth progress.', 
              'TODO', 
              '2026-01-22 09:15:00'
            ),
            (
              (SELECT id FROM users WHERE name = 'sa'), 
              (SELECT id FROM games WHERE title = 'Elden Ring'), 
              'Secrets & Easter Eggs', 
              'This guide uncovers secret locations, hidden bosses, and rare items in Elden Ring. We show how to discover hidden paths, which NPC quests lead to special rewards, and how to unlock secret skills and weapons. Also includes hints about Easter Eggs that reference other games. Players will receive valuable tips to fully explore the game.', 
              'TODO', 
              '2026-02-03 16:45:00'
            ),
            (
              (SELECT id FROM users WHERE name = 'sa'), 
              (SELECT id FROM games WHERE title = 'The Witcher 3'), 
              'Main Story Walkthrough', 
              'This guide covers the main quests of The Witcher 3: Wild Hunt. We guide players through all chapters and show how to make decisions that affect the game ending. Includes tips for combat, witcher signs, potions, and equipment. We also cover the most important story decisions to get the maximum experience and best possible rewards.', 
              'TODO', 
              '2026-01-08 11:20:00'
            ),
            (
              (SELECT id FROM users WHERE name = 'sa'), 
              (SELECT id FROM games WHERE title = 'The Witcher 3'), 
              'Gwent Strategy Guide', 
              'A comprehensive guide to the card game Gwent in The Witcher 3. Here you will learn how to build the best decks, analyze opponents, and collect cards efficiently. We explain the game mechanics, strategies against specific opponents, and provide tips for tournaments in Novigrad and Kaer Morhen.', 
              'TODO', 
              '2026-01-31 13:10:00'
            ),
            (
              (SELECT id FROM users WHERE name = 'test'), 
              (SELECT id FROM games WHERE title = 'Hades'), 
              'Beginner Hades Guide', 
              'Hades is a roguelike dungeon crawler. In this guide, beginners will learn how to survive the first runs, which weapons are suitable for starting out, how to combine god boons effectively, and which upgrades help in the long term. Also includes tips for healing, enemy groups, and bosses in the early levels. The goal is to optimally prepare players for later, more difficult runs.', 
              'TODO', 
              '2026-02-08 10:30:00'
            ),
            (
              (SELECT id FROM users WHERE name = 'test'), 
              (SELECT id FROM games WHERE title = 'Hades'), 
              'Advanced Hades Tactics', 
              'This guide is aimed at experienced Hades players. We analyze advanced builds, synergistic boons, optimal weapons, and the best strategies against the final bosses. Additionally, we provide hints for rare upgrades, chamber compositions, and secrets in the Underworld to achieve maximum high scores.', 
              'TODO', 
              '2026-02-14 15:25:00'
            ),
            (
              (SELECT id FROM users WHERE name = 'sa'), 
              (SELECT id FROM games WHERE title = 'The Witcher 3'), 
              'Romance Guide', 
              'This comprehensive guide covers all romance options in The Witcher 3: Wild Hunt. We detail the complete romance paths for Yennefer, Triss, and other secondary romance options like Keira Metz and Jutta an Dimun. Learn the specific dialogue choices, quest requirements, and timing needed to successfully pursue each romance. We also explain the consequences of your romantic choices on the story ending and character relationships. The guide includes tips for managing multiple romances, avoiding common mistakes, and achieving the best possible romantic outcomes. Special attention is given to the complex Yennefer-Triss dynamic and how to navigate this delicate situation without breaking hearts or missing out on meaningful content.', 
              'TODO', 
              '2026-01-12 18:40:00'
            ),
            (
              (SELECT id FROM users WHERE name = 'test'), 
              (SELECT id FROM games WHERE title = 'The Witcher 3'), 
              'Crafting & Alchemy Masterclass', 
              'Master the art of crafting and alchemy in The Witcher 3 with this detailed guide. We cover everything from basic weapon and armor crafting to advanced alchemical preparations. Learn where to find the best crafting diagrams, how to locate rare ingredients, and which merchants sell the most valuable schematics. The guide explains the alchemy system in depth, including how to create powerful potions, oils, and bombs that will give you an edge in combat. We provide complete walkthroughs for major crafting quests like the Master Armorers and Master Swordsmiths questlines. Discover the locations of all Grandmaster diagrams in the Blood and Wine expansion and learn how to craft the most powerful gear sets in the game. Tips for ingredient farming, mutagen creation, and optimizing your alchemical build are also included.', 
              'TODO', 
              '2026-02-01 12:55:00'
            ),
            (
              (SELECT id FROM users WHERE name = 'sa'), 
              (SELECT id FROM games WHERE title = 'The Witcher 3'), 
              'Complete Treasure Hunt Guide', 
              'Uncover every hidden treasure in The Witcher 3 with this exhaustive treasure hunting guide. We detail the locations of all witcher gear sets, including Griffin, Cat, Bear, Wolf, and Viper diagrams scattered throughout the main game and expansions. Each treasure hunt is covered with step-by-step instructions, maps, and tips for overcoming the challenges that guard these valuable rewards. Learn how to decode cryptic maps, solve environmental puzzles, and defeat the powerful guardians of ancient witcher artifacts. The guide also covers non-witcher treasure hunts, including hidden caches, smuggler''s treasures, and legendary weapon locations. We provide strategies for navigating dangerous dungeons, avoiding traps, and preparing for the tough battles that often precede major discoveries. Special sections dedicated to the Blood and Wine Grandmaster gear hunts and Hearts of Stone unique item locations.', 
              'TODO', 
              '2026-01-25 20:15:00'
            ),
            (
              (SELECT id FROM users WHERE name = 'test'), 
              (SELECT id FROM games WHERE title = 'The Witcher 3'), 
              'Character Build Guide', 
              'Create the perfect Geralt build with this comprehensive character development guide. We analyze all skill trees in detail: Combat, Alchemy, Signs, and General, providing recommendations for different playstyles from pure warrior to master mage. Learn which skills synergize best, how to allocate skill points efficiently, and which mutagens complement your chosen build. The guide covers popular builds like the Euphoria build, Signs build, Tank build, and Hybrid builds, complete with recommended equipment, decoctions, and playstyle strategies. We explain the mechanics behind attack power, sign intensity, and critical hit chance, helping you optimize Geralt''s stats for maximum effectiveness. Advanced topics include mutation systems, gear set bonuses, and how to adapt your build for different challenges like boss fights, contract monsters, or crowd control situations. Tips for respeccing and experimenting with different builds throughout your playthrough.', 
              'TODO', 
              '2026-02-10 14:20:00'
            ),
            (
              (SELECT id FROM users WHERE name = 'sa'), 
              (SELECT id FROM games WHERE title = 'The Witcher 3'), 
              'Expansion Content Guide', 
              'Master the additional content from Hearts of Stone and Blood and Wine expansions with this detailed guide. For Hearts of Stone, we provide complete walkthroughs for all main quests including the complex Heist missions, the mysterious Man of Glass questline, and the challenging encounters with Gaunter O''Dimm. Learn how to navigate the moral complexities of the expansion and achieve the best possible outcomes. For Blood and Wine, we cover the entire Toussaint experience from the initial investigation to the final confrontation with the Beast. The guide includes detailed maps of all new areas, complete walkthroughs for all main and secondary quests, and strategies for the unique tournament system. We also cover the new Grandmaster gear sets, the wine mechanics, and the estate management system. Special attention is given to the multiple endings and how your choices throughout both expansions affect the final outcomes. Tips for level-appropriate progression and optimal quest sequencing are included.', 
              'TODO', 
              '2026-01-18 17:35:00'
            );
        `);
    };
}
