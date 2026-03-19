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
          profilePicturePath TEXT,
          dashboardLayout TEXT DEFAULT '["analysis", "games", "guides"]'
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
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
          score INTEGER NOT NULL CHECK(score >= 1 AND score <= 5),
          UNIQUE (userId, guideId),
          FOREIGN KEY (userId) REFERENCES users(id),
          FOREIGN KEY (guideId) REFERENCES guides(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS guide_comments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER NOT NULL,
          guideId INTEGER NOT NULL,
          commentText TEXT,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (userId) REFERENCES users(id),
          FOREIGN KEY (guideId) REFERENCES guides(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS screenshots (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          guideId INTEGER NOT NULL,
          filePath TEXT,
          FOREIGN KEY (guideId) REFERENCES guides(id) ON DELETE CASCADE,
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
            ('Elden Ring','Open-World-Action-RPG in einer düsteren Fantasy-Welt.','soulslike','soulslike,open-world,fantasy','PC,PS5,Xbox','FromSoftware','Bandai Namco','2022-02-25','EldenRing.jpg',9.8),
            ('The Witcher 3','Storylastiges Rollenspiel rund um Geralt von Riva.','rpg','rpg,story,open-world,fantasy','PC,PS5,Xbox','CD Projekt Red','CD Projekt','2015-05-19','TheWitcher3.jpg',9.7),
            ('Stardew Valley','Entspannendes Farming- und Lebenssimulationsspiel.','simulation','simulation,farming,indie,relaxing','PC,Switch,PS','ConcernedApe','ConcernedApe','2016-02-26','StardewValley.jpg',9.2),
            ('Hades','Roguelike-Actionspiel mit starkem Fokus auf Story und Gameplay.','roguelike','roguelike,action,indie','PC,Switch,PS,Xbox','Supergiant Games','Supergiant Games','2020-09-17','Hades.jpg',9.4),
            ('Minecraft','Sandbox-Spiel mit Fokus auf Kreativität und Exploration.','sandbox','sandbox,building,survival,creative','PC,Mobile,Console','Mojang','Microsoft','2011-11-18','Minecraft.jpg',9.5),
            ('Cyberpunk 2077', 'Futuristisches Open-World-RPG in Night City.', 'rpg', 'open-world,story,shooter', 'PC,PS5,Xbox', 'CD Projekt Red', 'CD Projekt', '2020-12-10', 'Cyberpunk 2077.jpg', 8.2),
            ('God of War', 'Action-Adventure rund um Kratos und seinen Sohn Atreus.', 'adventure', 'adventure,mythology,story,action', 'PS4,PS5', 'Santa Monica Studio', 'Sony', '2018-04-20', 'God of War.avif', 9.6),
            ('Assassin''s Creed Valhalla', 'Open-World-Actionspiel in der Wikingerzeit.', 'rpg', 'rpg,open-world,story', 'PC,PS5,Xbox', 'Ubisoft Montreal', 'Ubisoft', '2020-11-10', 'Assassins Creed Valhalla.jpg', 8.5),
            ('Hollow Knight', 'Metroidvania-Spiel in einer düsteren Welt voller Insekten.', 'metroidvania', 'metroidvania,indie,platformer,adventure', 'PC,Switch,PS', 'Team Cherry', 'Team Cherry', '2017-02-24', 'Hollow Knight.jpg', 9.3),
            ('Celeste', 'Plattformspiel über eine schwierige Bergbesteigung.', 'platformer', 'platformer,indie,story', 'PC,Switch,PS,Xbox', 'Matt Makes Games', 'Matt Makes Games', '2018-01-25', 'Celeste.jpg', 9.0),
            ('The Legend of Zelda: Breath of the Wild', 'Open-World-Abenteuer in Hyrule.', 'adventure', 'adventure,open-world,exploration,fantasy', 'Switch', 'Nintendo EPD', 'Nintendo', '2017-03-03', 'Zelda.jpg', 9.8),
            ('Super Mario Odyssey', '3D-Plattform-Abenteuer rund um Mario.', 'platformer', 'platformer,adventure', 'Switch', 'Nintendo EPD', 'Nintendo', '2017-10-27', 'Super Mario Odessey.jpg', 9.6),
            ('Doom Eternal', 'Fast-paced First-Person-Shooter gegen Dämonen.', 'fps', 'fps,action,shooter,demons', 'PC,PS5,Xbox', 'id Software', 'Bethesda', '2020-03-20', 'Doom Eternal.jpg', 9.1),
            ('Resident Evil Village', 'Survival-Horror in einem mysteriösen Dorf.', 'horror', 'horror,survival,story', 'PC,PS5,Xbox', 'Capcom', 'Capcom', '2021-05-07', 'Resident Evil Village.jpg', 8.9),
            ('Fortnite', 'Battle Royale Shooter mit Bauelementen.', 'shooter', 'shooter,battle-royale,multiplayer', 'PC,PS5,Xbox,Mobile', 'Epic Games', 'Epic Games', '2017-07-21', 'Fortnite.jpg', 8.0),
            ('League of Legends', 'MOBA-Spiel mit strategischen Kämpfen.', 'moba', 'moba,strategy,multiplayer,competitive', 'PC', 'Riot Games', 'Riot Games', '2009-10-27', 'League of Legends.jpg', 9.0),
            ('Valorant', 'Taktischer 5v5 Shooter.', 'fps', 'fps,shooter,multiplayer,competitive', 'PC', 'Riot Games', 'Riot Games', '2020-06-02', '', 8.7),
            ('Animal Crossing: New Horizons', 'Lebenssimulation auf einer Insel.', 'simulation', 'simulation,relaxing', 'Switch', 'Nintendo EPD', 'Nintendo', '2020-03-20', '', 9.2),
            ('Final Fantasy VII Remake', 'Action-RPG in der Welt von Midgar.', 'rpg', 'rpg,story,action,fantasy', 'PS4,PS5', 'Square Enix', 'Square Enix', '2020-04-10', '', 9.3),
            ('Monster Hunter: World', 'Action-RPG mit großen Monstern und Teamplay.', 'rpg', 'rpg,action,coop', 'PC,PS4,Xbox', 'Capcom', 'Capcom', '2018-01-26', 'Monster Hunter World.jpg', 9.1),
            ('Destiny','First-Person-Shooter mit MMO-Elementen, epischen Raids und kooperativen Missionen in einer futuristischen Welt.','mmo','mmo,shooter,coop,space,action','PC,PS5,Xbox','Bungie','Bungie','2014-09-09','Destiny.jpg',9.1),
            ('Teamfight Tactics','Autobattler-Spiel im League of Legends-Universum, strategisches Platzieren von Champions und Items.','strategy','strategy,autobattler,tactics,turn-based','PC','Riot Games','Riot Games','2019-06-26','League of Legends.jpg',8.5),
            ('Overwatch','Team-basierter Multiplayer-Shooter mit einzigartigen Heldenfähigkeiten und schneller Action.','fps','fps,shooter,multiplayer,team-based,competitive','PC,PS5,Xbox,Switch','Blizzard Entertainment','Blizzard Entertainment','2016-05-24','Overwatch.jpg',9.0),
            ('Starcraft 2','Strategie-Echtzeitspiel mit drei einzigartigen Rassen, epischer Kampagne und kompetitivem Multiplayer.','rts','rts,strategy,real-time,space,competitive,story','PC','Blizzard Entertainment','Blizzard Entertainment','2010-07-27','Starcraft 2.jpg',9.3),
            ('Hearthstone','Digitales Kartenspiel basierend auf dem Warcraft-Universum, strategisches Deckbuilding und Online-Kämpfe.','card game','card-game,warcraft,strategy,collectible','PC,Mobile,Mac','Blizzard Entertainment','Blizzard Entertainment','2014-03-11','Hearthstone.jpg',8.7),
            ('Paladins','Hero-Shooter mit verschiedenen Klassen, kooperativen Missionen und kompetitivem Spielmodus.','fps','fps,shooter,hero,team-based,action','PC,PS5,Xbox,Switch','Hi-Rez Studios','Hi-Rez Studios','2016-09-16','Paladins.jpg',8.4),
            ('Factorio','Industrielles Aufbauspiel, Fabriken bauen, Ressourcen automatisieren und Produktionsketten optimieren.','simulation','simulation,strategy,management','PC','Wube Software','Wube Software','2020-08-14','Factorio.jpg',9.0),
            ('RimWorld','Kolonie-Simulation auf einem fremden Planeten, Überleben, Charaktermanagement und Storytelling.','simulation','simulation.management,indie,survival','PC','Ludeon Studios','Ludeon Studios','2018-10-17','RimWorld.jpg',9.1),
            ('Rainbow Six Siege','Taktischer Multiplayer-Shooter, Zerstörung der Umgebung und Teamplay im Fokus.','fps','fps,shooter,tactical,multiplayer,competitive,team','PC,PS5,Xbox','Ubisoft','Ubisoft','2015-12-01','Rainbow Six Siege.avif',9.0),
            ('World of Warships','Online-PvP-Seeschlachten, Schiffsklassen, Strategie und taktisches Gameplay.','naval combat','naval-combat,strategy,multiplayer','PC','Wargaming','Wargaming','2015-09-17','World of Warships.jpg',8.6),
            ('For Honor','Nahkampf-Actionspiel mit mittelalterlichen Kriegern, Multiplayer- und Einzelspieler-Modi.','action','action,medieval,multiplayer','PC,PS5,Xbox','Ubisoft','Ubisoft','2017-02-14','For Honor.avif',8.7),
            ('Far Cry 2','Open-World-Actionspiel in Afrika, realistische Schadensmechanik und dynamische Story.','adventure','adventure,shooter,open-world,action,story','PC,PS4,Xbox','Ubisoft','Ubisoft','2008-10-21','questionmark.webp',8.3),
            ('Far Cry 3','Open-World-Actionspiel mit Inselsetting, Crafting, Story-Entscheidungen und Stealth-Elementen.','adventure','adventure,shooter,open-world,action,story','PC,PS4,Xbox','Ubisoft','Ubisoft','2012-11-29','questionmark.webp',9.0),
            ('Far Cry 4','Open-World-Actionspiel in den Himalaya-Bergen, Erkundung, Quests und Waffenvielfalt.','adventure','adventure,shooter,open-world,action,exploration,story','PC,PS4,Xbox','Ubisoft','Ubisoft','2014-11-18','questionmark.webp',8.9),
            ('Far Cry 5','Open-World-Shooter in Montana, USA, Storymissionen, Multiplayer und Koop-Modus.','adventure','adventure,shooter,open-world,action,story','PC,PS4,Xbox','Ubisoft','Ubisoft','2018-03-27','questionmark.webp',8.8),
            ('Far Cry 6','Open-World-Actionspiel in fiktivem tropischen Setting, Story, Missionen und Fahrzeuge.','adventure','adventure,shooter,open-world,action,story','PC,PS5,Xbox','Ubisoft','Ubisoft','2021-10-07','questionmark.webp',8.7),
            ('Battlefield 3','First-Person-Shooter mit großen Multiplayer-Schlachten, Fahrzeugen und realistischem Gameplay.','fps','fps,shooter,multiplayer,action','PC,PS4,Xbox','DICE','Electronic Arts','2011-10-25','questionmark.webp',9.0),
            ('Battlefield 4','Multiplayer-Shooter mit dynamischen Karten, Teamplay und realistischem Schadensmodell.','fps','fps,shooter,multiplayer,action,team','PC,PS4,Xbox','DICE','Electronic Arts','2013-10-29','questionmark.webp',8.8),
            ('Call of Duty: Modern Warfare','Moderne Militär-Shooter-Serie mit Einzelspieler-Kampagne und Multiplayer-Modi.','fps','fps,shooter,action,competitive','PC,PS4,Xbox','Infinity Ward','Activision','2019-10-25','questionmark.webp',9.2),
            ('Horizon Zero Dawn','Open-World-Action-RPG mit Roboterdinosauriern, Crafting und Story-Entscheidungen.','adventure','adventure,action,rpg,open-world,story','PC,PS4','Guerrilla Games','Sony','2017-02-28','Horizon Zero Dawn.jpg',9.1),
            ('Horizon Forbidden West','Fortsetzung von Horizon Zero Dawn, neue Welt, Story, Kampf gegen Maschinen und Erkundung.','adventure','adventure,action,rpg,open-world,story,adventure','PC,PS5','Guerrilla Games','Sony','2022-02-18','Horizon Forbidden West.webp',9.3),
            ('Clair Obscur: Expedition 33', 'Clair Obscur: Expedition 33 ist ein preisgekröntes, von der Kritik gefeiertes Rollenspiel aus dem Jahr 2025, entwickelt von dem französischen Studio Sandfall Interactive und veröffentlicht von Kepler Interactive. Das Spiel kombiniert eine tiefgründige narrative Struktur mit taktischen rundenbasierten Kämpfen, kunstvoller Belle‑Époque‑inspirierten Weltgestaltung und emotional aufgeladenen Charakterbögen. Spieler begleiten eine Expedition gegen eine mysteriöse, übernatürliche Bedrohung in einer eindrucksvoll gestalteten Fantasy‑Welt, in der Licht‑ und Schattenmotivik als zentrales künstlerisches Thema dient. Clair Obscur erhielt zahlreiche Auszeichnungen, darunter Game of the Year 2025 bei den The Game Awards, Best Narrative, Best Art Direction und Best Score und wurde von Kritikern und Spielern für seine Story, Musik und visuelle Gestaltung gelobt. Das Spiel wurde am 24. April 2025 für PlayStation 5, Windows und Xbox Series X/S veröffentlicht und verkaufte bis Ende 2025 über fünf Millionen Einheiten.', 'adventure', 'adventure,rpg,story,turn-based,fantasy', 'PC,PS5,Xbox', 'Sandfall Interactive', 'Kepler Interactive', '2025-04-24', 'Clair Obscure.jpg', 9.8);

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
            (name, email, passwordHash)
          VALUES
            (
              'sa',
              'sa@test.de',
              '4cf6829aa93728e8f3c97df913fb1bfa95fe5810e2933a05943f8312a98d9cf2' --sa
            ),
            (
              'test',
              'test@test.de',
              '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08' --test
            );

          
            -- =========================
            -- GUIDES
            -- =========================
            

        -- Elden Ring (sa)
            INSERT OR IGNORE INTO guides (userId, gameId, title, content)
            VALUES (
            (SELECT id FROM users WHERE name = 'sa'),
            (SELECT id FROM games WHERE title = 'Elden Ring'),
            'Elden Ring Rune Farming Guide',
            'In diesem Guide zeigen wir dir die effizientesten Methoden zum Runen farmen. Du lernst Spots für Early-, Mid- und Late-Game kennen sowie Builds, die besonders gut zum Farmen geeignet sind. Zusätzlich erklären wir, wie du Risiko minimierst und trotzdem schnell Fortschritt machst.'
            );

            -- Elden Ring (test)
            INSERT OR IGNORE INTO guides (userId, gameId, title, content)
            VALUES (
            (SELECT id FROM users WHERE name = 'test'),
            (SELECT id FROM games WHERE title = 'Elden Ring'),
            'Elden Ring Build Guide Strength vs Dexterity',
            'Dieser Guide vergleicht Strength- und Dexterity-Builds. Du lernst die Vor- und Nachteile beider Spielstile kennen und bekommst konkrete Empfehlungen für Waffen, Talismane und Stats.'
            );

            -- Witcher 3 (sa)
            INSERT OR IGNORE INTO guides (userId, gameId, title, content)
            VALUES (
            (SELECT id FROM users WHERE name = 'sa'),
            (SELECT id FROM games WHERE title = 'The Witcher 3'),
            'Witcher 3 Money Farming Guide',
            'In diesem Guide zeigen wir dir die besten Methoden, um schnell Geld zu verdienen. Von Verträgen über Loot-Routen bis hin zu Crafting-Tricks – du lernst, wie du effizient Crowns farmst.'
            );

            -- Witcher 3 (test)
            INSERT OR IGNORE INTO guides (userId, gameId, title, content)
            VALUES (
            (SELECT id FROM users WHERE name = 'test'),
            (SELECT id FROM games WHERE title = 'The Witcher 3'),
            'Witcher 3 Best Armor Sets Guide',
            'Dieser Guide stellt dir die besten Rüstungssets im Spiel vor. Du erfährst, wo du sie findest und für welche Builds sie sich am besten eignen.'
            );

            -- Hades (sa)
            INSERT OR IGNORE INTO guides (userId, gameId, title, content)
            VALUES (
            (SELECT id FROM users WHERE name = 'sa'),
            (SELECT id FROM games WHERE title = 'Hades'),
            'Hades Weapon Tier List Guide',
            'In diesem Guide vergleichen wir alle Waffen in Hades und ordnen sie nach Effektivität ein. Du lernst, welche Waffen sich für Anfänger und welche für erfahrene Spieler eignen.'
            );

            -- Hades (test)
            INSERT OR IGNORE INTO guides (userId, gameId, title, content)
            VALUES (
            (SELECT id FROM users WHERE name = 'test'),
            (SELECT id FROM games WHERE title = 'Hades'),
            'Hades Boss Strategy Guide',
            'Dieser Guide erklärt dir alle Bosskämpfe in Hades im Detail. Du lernst Angriffsmuster, sichere Positionierung und effektive Counter-Strategien.'
            );

            -- Elden Ring (sa)
            INSERT OR IGNORE INTO guides (userId, gameId, title, content)
            VALUES (
            (SELECT id FROM users WHERE name = 'sa'),
            (SELECT id FROM games WHERE title = 'Elden Ring'),
            'Elden Ring Beginner Guide',
            'Dieser Guide richtet sich an Einsteiger in Elden Ring. Du lernst die wichtigsten Grundlagen wie Movement, Stamina-Management und den richtigen Umgang mit Waffen und Schilden. Besonders im Early Game ist es entscheidend, Kämpfe nicht zu überstürzen und Gegner zu beobachten. Außerdem geben wir Tipps zu sinnvollen Startklassen, ersten Bossen und wie du effizient Runen farmst, ohne unnötig zu sterben.'
            );

            -- Witcher 3 (sa)
            INSERT OR IGNORE INTO guides (userId, gameId, title, content)
            VALUES (
            (SELECT id FROM users WHERE name = 'sa'),
            (SELECT id FROM games WHERE title = 'The Witcher 3'),
            'Witcher 3 Story & Decision Guide',
            'In diesem Guide geht es um die wichtigsten Story-Entscheidungen in The Witcher 3 und deren Auswirkungen. Viele Quests haben langfristige Konsequenzen, die sich erst Stunden später zeigen. Du erfährst, wie du die besten Enden erreichst, welche Dialogoptionen kritisch sind und wie sich deine Entscheidungen auf Ciri und andere Charaktere auswirken. Zusätzlich geben wir Hinweise, wie du Nebenquests optimal in die Hauptstory integrierst.'
            );

            -- Hades (sa)
            INSERT OR IGNORE INTO guides (userId, gameId, title, content)
            VALUES (
            (SELECT id FROM users WHERE name = 'sa'),
            (SELECT id FROM games WHERE title = 'Hades'),
            'Hades Build Guide',
            'Dieser Guide erklärt dir, wie du starke Builds in Hades zusammenstellst. Der Fokus liegt auf der Kombination von Boons, Waffen-Aspekten und Spiegel-Upgrades. Du lernst, welche Götter besonders gut miteinander synergieren und wie du deine Runs gezielt planst. Zusätzlich zeigen wir dir, welche Builds für Anfänger geeignet sind und welche Strategien dir helfen, Bosse konsistent zu besiegen.'
            );

            -- Elden Ring (test)
            INSERT OR IGNORE INTO guides (userId, gameId, title, content)
            VALUES (
            (SELECT id FROM users WHERE name = 'test'),
            (SELECT id FROM games WHERE title = 'Elden Ring'),
            'Elden Ring Boss Guide',
            'Dieser Guide konzentriert sich auf die wichtigsten Bosskämpfe in Elden Ring. Du bekommst detaillierte Strategien zu Angriffsmustern, Ausweich-Timings und Schwachstellen der Bosse. Besonders wichtig ist es, Geduld zu bewahren und die Movesets zu lernen, statt aggressiv zu spielen. Zusätzlich geben wir Empfehlungen für Waffen, Beschwörungen und Builds, die dir den Kampf deutlich erleichtern.'
            );

            -- Witcher 3 (test)
            INSERT OR IGNORE INTO guides (userId, gameId, title, content)
            VALUES (
            (SELECT id FROM users WHERE name = 'test'),
            (SELECT id FROM games WHERE title = 'The Witcher 3'),
            'Witcher 3 Alchemy & Crafting Guide',
            'In diesem Guide lernst du die Alchemie- und Crafting-Systeme von The Witcher 3 im Detail kennen. Tränke, Öle und Bomben sind essenziell für schwierigere Kämpfe und geben dir enorme Vorteile. Wir erklären dir, welche Rezepte Priorität haben, wo du seltene Zutaten findest und wie du deine Ausrüstung optimal verbesserst. Außerdem zeigen wir dir, wie du dich gezielt auf Monsterjagden vorbereitest.'
            );

            -- Hades (test)
            INSERT OR IGNORE INTO guides (userId, gameId, title, content)
            VALUES (
            (SELECT id FROM users WHERE name = 'test'),
            (SELECT id FROM games WHERE title = 'Hades'),
            'Hades Advanced Strategy Guide',
            'Dieser Guide richtet sich an fortgeschrittene Spieler, die ihre Runs in Hades optimieren möchten. Wir analysieren komplexe Boon-Synergien, High-Damage-Builds und effiziente Raumwahl. Du lernst, wie du Risiken richtig einschätzt und deine Ressourcen über einen gesamten Run hinweg managst. Zusätzlich geben wir dir Tipps für Heat-Level und Endgame-Content.'
            );

            -- =========================
            -- RATINGS
            -- =========================


            -- test bewertet Guides von sa
            INSERT OR IGNORE INTO guide_rating (userId, guideId, score)
            SELECT
            (SELECT id FROM users WHERE name = 'test'),
            g.id,
            CASE
                WHEN g.title LIKE '%Beginner%' THEN 5
                WHEN g.title LIKE '%Farming%' THEN 4
                WHEN g.title LIKE '%Story%' THEN 5
                ELSE 4
            END
            FROM guides g
            WHERE g.userId = (SELECT id FROM users WHERE name = 'sa')
            AND g.gameId IN (
            SELECT id FROM games WHERE title IN ('Elden Ring','The Witcher 3','Hades')
            );

            -- sa bewertet Guides von test
            INSERT OR IGNORE INTO guide_rating (userId, guideId, score)
            SELECT
            (SELECT id FROM users WHERE name = 'sa'),
            g.id,
            CASE
                WHEN g.title LIKE '%Boss%' THEN 5
                WHEN g.title LIKE '%Build%' THEN 4
                WHEN g.title LIKE '%Armor%' THEN 5
                WHEN g.title LIKE '%Advanced%' THEN 4
                ELSE 4
            END
            FROM guides g
            WHERE g.userId = (SELECT id FROM users WHERE name = 'test')
            AND g.gameId IN (
            SELECT id FROM games WHERE title IN ('Elden Ring','The Witcher 3','Hades')
            );

            -- =========================
            -- COMMENTS
            -- =========================

            INSERT OR IGNORE INTO guide_comments (userId, guideId, commentText)
            SELECT 
            (SELECT id FROM users WHERE name = 'test'),
            g.id,
            'Sehr hilfreicher Guide! Besonders die Erklärungen zu den Grundlagen waren verständlich und gut strukturiert.'
            FROM guides g
            WHERE g.userId = (SELECT id FROM users WHERE name = 'sa');

            INSERT OR IGNORE INTO guide_comments (userId, guideId, commentText)
            SELECT 
            (SELECT id FROM users WHERE name = 'test'),
            g.id,
            'Hat mir echt beim Einstieg geholfen. Vielleicht könntest du noch ein paar konkrete Beispiele oder Builds ergänzen.'
            FROM guides g
            WHERE g.userId = (SELECT id FROM users WHERE name = 'sa');

            INSERT OR IGNORE INTO guide_comments (userId, guideId, commentText)
            SELECT 
            (SELECT id FROM users WHERE name = 'sa'),
            g.id,
            'Starker Guide! Die Strategien sind gut erklärt und direkt umsetzbar. Hat mir definitiv weitergeholfen.'
            FROM guides g
            WHERE g.userId = (SELECT id FROM users WHERE name = 'test');

            INSERT OR IGNORE INTO guide_comments (userId, guideId, commentText)
            SELECT 
            (SELECT id FROM users WHERE name = 'sa'),
            g.id,
            'Sehr detailliert geschrieben. Besonders die Tipps zu Builds und Synergien fand ich hilfreich.'
            FROM guides g
            WHERE g.userId = (SELECT id FROM users WHERE name = 'test');

            INSERT OR IGNORE INTO guide_comments (userId, guideId, commentText)
            SELECT 
            (SELECT id FROM users WHERE name = 'test'),
            g.id,
            'Richtig guter Guide, hat mir direkt weitergeholfen. Besonders die Struktur ist top.'
            FROM guides g
            WHERE g.userId = (SELECT id FROM users WHERE name = 'sa')
            AND g.gameId IN (
            SELECT id FROM games WHERE title IN ('Elden Ring','The Witcher 3','Hades')
            );

            INSERT OR IGNORE INTO guide_comments (userId, guideId, commentText)
            SELECT 
            (SELECT id FROM users WHERE name = 'test'),
            g.id,
            'Sehr solide erklärt. Ein paar mehr konkrete Beispiele wären noch nice.'
            FROM guides g
            WHERE g.userId = (SELECT id FROM users WHERE name = 'sa')
            AND g.gameId IN (
            SELECT id FROM games WHERE title IN ('Elden Ring','The Witcher 3','Hades')
            );

            -- sa → test
            INSERT OR IGNORE INTO guide_comments (userId, guideId, commentText)
            SELECT 
            (SELECT id FROM users WHERE name = 'sa'),
            g.id,
            'Mega hilfreich geschrieben. Vor allem die Tipps zu den Bossen sind stark.'
            FROM guides g
            WHERE g.userId = (SELECT id FROM users WHERE name = 'test')
            AND g.gameId IN (
            SELECT id FROM games WHERE title IN ('Elden Ring','The Witcher 3','Hades')
            );

            INSERT OR IGNORE INTO guide_comments (userId, guideId, commentText)
            SELECT 
            (SELECT id FROM users WHERE name = 'sa'),
            g.id,
            'Sehr detailliert und gut verständlich. Genau solche Guides braucht man.'
            FROM guides g
            WHERE g.userId = (SELECT id FROM users WHERE name = 'test')
            AND g.gameId IN (
            SELECT id FROM games WHERE title IN ('Elden Ring','The Witcher 3','Hades')
            );
        `);
    };
}
