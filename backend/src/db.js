"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Db = void 0;
var sqlite3_1 = require("sqlite3");
var sqlite_1 = require("sqlite");
var Db = /** @class */ (function () {
    function Db() {
        var _this = this;
        this.openDB = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, sqlite_1.open)({
                            filename: './database.sqlite',
                            driver: sqlite3_1.default.Database,
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.setupDatabase = function () { return __awaiter(_this, void 0, void 0, function () {
            var db;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.openDB()];
                    case 1:
                        db = _a.sent();
                        return [4 /*yield*/, db.exec("\n        PRAGMA foreign_keys = ON;\n\n        CREATE TABLE IF NOT EXISTS users (\n          id INTEGER PRIMARY KEY AUTOINCREMENT,\n          name TEXT NOT NULL UNIQUE,\n          email TEXT NOT NULL UNIQUE,\n          passwordHash TEXT NOT NULL,\n          profilePicturePath TEXT\n        );\n\n        CREATE TABLE IF NOT EXISTS games (\n          id INTEGER PRIMARY KEY AUTOINCREMENT,\n          title TEXT NOT NULL UNIQUE,\n          description TEXT NOT NULL,\n          genre TEXT NOT NULL,\n          tags TEXT NOT NULL,\n          platform TEXT NOT NULL,\n          developer TEXT NOT NULL,\n          publisher TEXT NOT NULL,\n          releaseDate DATETIME NOT NULL,\n          imageName TEXT,\n          popularityScore FLOAT\n        );\n\n        CREATE TABLE IF NOT EXISTS achievements (\n          id INTEGER PRIMARY KEY AUTOINCREMENT,\n          gameId INTEGER NOT NULL,\n          title TEXT NOT NULL,\n          description TEXT NOT NULL,\n          difficulty TEXT NOT NULL CHECK(difficulty IN ('bronze', 'silver', 'gold', 'platinum')),\n          FOREIGN KEY (gameId) REFERENCES games(id),\n          UNIQUE(gameId, title)\n        );\n\n        CREATE TABLE IF NOT EXISTS guides (\n          id INTEGER PRIMARY KEY AUTOINCREMENT,\n          userId INTEGER NOT NULL,\n          gameId INTEGER NOT NULL,\n          title TEXT NOT NULL,\n          content TEXT NOT NULL,\n          pdfPath TEXT,\n          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n          FOREIGN KEY (userId) REFERENCES users(id),\n          FOREIGN KEY (gameId) REFERENCES games(id),\n          UNIQUE(userId, gameId, title)\n        );\n\n        CREATE TABLE IF NOT EXISTS user_games (\n          userId INTEGER NOT NULL,\n          gameId INTEGER NOT NULL,\n          isFavorite BOOLEAN,\n          addedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n          PRIMARY KEY (userId, gameId),\n          FOREIGN KEY (userId) REFERENCES users(id),\n          FOREIGN KEY (gameId) REFERENCES games(id),\n          UNIQUE (userId, gameId)\n        );\n\n        CREATE TABLE IF NOT EXISTS user_achievements (\n          userId INTEGER NOT NULL,\n          achievementId INTEGER NOT NULL,\n          gameId INTEGER NOT NULL,\n          completedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n          PRIMARY KEY (userId, achievementId),\n          FOREIGN KEY (userId) REFERENCES users(id),\n          FOREIGN KEY (achievementId) REFERENCES achievements(id),\n          UNIQUE (userId, achievementId)\n        );\n\n        CREATE TABLE IF NOT EXISTS guide_rating (\n          id INTEGER PRIMARY KEY AUTOINCREMENT,\n          userId INTEGER NOT NULL,\n          guideId INTEGER NOT NULL,\n          score INTEGER,\n          UNIQUE (userId, guideId),\n          FOREIGN KEY (userId) REFERENCES users(id),\n          FOREIGN KEY (guideId) REFERENCES guides(id)\n        );\n\n        CREATE TABLE IF NOT EXISTS guide_comments (\n          id INTEGER PRIMARY KEY AUTOINCREMENT,\n          userId INTEGER NOT NULL,\n          guideId INTEGER NOT NULL,\n          commentText TEXT,\n          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n          FOREIGN KEY (userId) REFERENCES users(id),\n          FOREIGN KEY (guideId) REFERENCES guides(id),\n          UNIQUE (userId, guideId, commentText)\n        );\n\n        CREATE TABLE IF NOT EXISTS screenshots (\n          id INTEGER PRIMARY KEY AUTOINCREMENT,\n          guideId INTEGER NOT NULL,\n          filePath TEXT,\n          FOREIGN KEY (guideId) REFERENCES guides(id),\n          UNIQUE (guideId, filePath)\n        );\n      ")];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, db.close()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.createInitialData = function () { return __awaiter(_this, void 0, void 0, function () {
            var db;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.openDB()];
                    case 1:
                        db = _a.sent();
                        return [4 /*yield*/, db.exec("\n          PRAGMA foreign_keys = ON;\n\n          INSERT OR IGNORE INTO games\n            (title, description, genre, tags, platform, developer, publisher, releaseDate, imageName, popularityScore)\n          VALUES\n            ('Elden Ring','Open-World-Action-RPG in einer d\u00FCsteren Fantasy-Welt.','action rpg','soulslike,open-world,fantasy','PC,PS5,Xbox','FromSoftware','Bandai Namco','2022-02-25','EldenRing.jpg',9.8),\n            ('The Witcher 3','Storylastiges Rollenspiel rund um Geralt von Riva.','rpg','story,open-world,fantasy','PC,PS5,Xbox','CD Projekt Red','CD Projekt','2015-05-19','TheWitcher3.jpg',9.7),\n            ('Stardew Valley','Entspannendes Farming- und Lebenssimulationsspiel.','simulation','farming,indie,relaxing','PC,Switch,PS','ConcernedApe','ConcernedApe','2016-02-26','StardewValley.jpg',9.2),\n            ('Hades','Roguelike-Actionspiel mit starkem Fokus auf Story und Gameplay.','roguelike','roguelike,action,indie','PC,Switch,PS,Xbox','Supergiant Games','Supergiant Games','2020-09-17','Hades.webp',9.4),\n            ('Minecraft','Sandbox-Spiel mit Fokus auf Kreativit\u00E4t und Exploration.','sandbox','building,survival,creative','PC,Mobile,Console','Mojang','Microsoft','2011-11-18','Minecraft.jpg',9.5),\n            ('Cyberpunk 2077', 'Futuristisches Open-World-RPG in Night City.', 'rpg', 'open-world,story,shooter', 'PC,PS5,Xbox', 'CD Projekt Red', 'CD Projekt', '2020-12-10', '', 8.2),\n            ('God of War', 'Action-Adventure rund um Kratos und seinen Sohn Atreus.', 'action adventure', 'mythology,story,action', 'PS4,PS5', 'Santa Monica Studio', 'Sony', '2018-04-20', '', 9.6),\n            ('Assassin''s Creed Valhalla', 'Open-World-Actionspiel in der Wikingerzeit.', 'action rpg', 'open-world,story', 'PC,PS5,Xbox', 'Ubisoft Montreal', 'Ubisoft', '2020-11-10', '', 8.5),\n            ('Hollow Knight', 'Metroidvania-Spiel in einer d\u00FCsteren Welt voller Insekten.', 'metroidvania', 'indie,platformer,adventure', 'PC,Switch,PS', 'Team Cherry', 'Team Cherry', '2017-02-24', '', 9.3),\n            ('Celeste', 'Plattformspiel \u00FCber eine schwierige Bergbesteigung.', 'platformer', 'indie,story', 'PC,Switch,PS,Xbox', 'Matt Makes Games', 'Matt Makes Games', '2018-01-25', '', 9.0),\n            ('The Legend of Zelda: Breath of the Wild', 'Open-World-Abenteuer in Hyrule.', 'adventure', 'open-world,exploration,fantasy', 'Switch', 'Nintendo EPD', 'Nintendo', '2017-03-03', '', 9.8),\n            ('Super Mario Odyssey', '3D-Plattform-Abenteuer rund um Mario.', 'platformer', 'platformer,adventure', 'Switch', 'Nintendo EPD', 'Nintendo', '2017-10-27', '', 9.6),\n            ('Doom Eternal', 'Fast-paced First-Person-Shooter gegen D\u00E4monen.', 'fps', 'action,shooter,demons', 'PC,PS5,Xbox', 'id Software', 'Bethesda', '2020-03-20', '', 9.1),\n            ('Resident Evil Village', 'Survival-Horror in einem mysteri\u00F6sen Dorf.', 'horror', 'survival,horror,story', 'PC,PS5,Xbox', 'Capcom', 'Capcom', '2021-05-07', '', 8.9),\n            ('Fortnite', 'Battle Royale Shooter mit Bauelementen.', 'shooter', 'battle-royale,multiplayer', 'PC,PS5,Xbox,Mobile', 'Epic Games', 'Epic Games', '2017-07-21', '', 8.0),\n            ('League of Legends', 'MOBA-Spiel mit strategischen K\u00E4mpfen.', 'moba', 'strategy,multiplayer,competitive', 'PC', 'Riot Games', 'Riot Games', '2009-10-27', '', 9.0),\n            ('Valorant', 'Taktischer 5v5 Shooter.', 'fps', 'shooter,multiplayer,competitive', 'PC', 'Riot Games', 'Riot Games', '2020-06-02', '', 8.7),\n            ('Animal Crossing: New Horizons', 'Lebenssimulation auf einer Insel.', 'simulation', 'relaxing', 'Switch', 'Nintendo EPD', 'Nintendo', '2020-03-20', '', 9.2),\n            ('Final Fantasy VII Remake', 'Action-RPG in der Welt von Midgar.', 'rpg', 'story,action,fantasy', 'PS4,PS5', 'Square Enix', 'Square Enix', '2020-04-10', '', 9.3),\n            ('Monster Hunter: World', 'Action-RPG mit gro\u00DFen Monstern und Teamplay.', 'action rpg', 'action,rpg,coop', 'PC,PS4,Xbox', 'Capcom', 'Capcom', '2018-01-26', '', 9.1),\n            ('Destiny','First-Person-Shooter mit MMO-Elementen, epischen Raids und kooperativen Missionen in einer futuristischen Welt.','fps mmo','shooter,coop,space,action','PC,PS5,Xbox','Bungie','Bungie','2014-09-09','',9.1),\n            ('Teamfight Tactics','Autobattler-Spiel im League of Legends-Universum, strategisches Platzieren von Champions und Items.','strategy','autobattler,strategy,tactics,turn-based','PC','Riot Games','Riot Games','2019-06-26','',8.5),\n            ('Overwatch','Team-basierter Multiplayer-Shooter mit einzigartigen Heldenf\u00E4higkeiten und schneller Action.','fps','shooter,multiplayer,team-based,competitive','PC,PS5,Xbox,Switch','Blizzard Entertainment','Blizzard Entertainment','2016-05-24','',9.0),\n            ('Starcraft 2','Strategie-Echtzeitspiel mit drei einzigartigen Rassen, epischer Kampagne und kompetitivem Multiplayer.','rts','strategy,real-time,space,competitive,story','PC','Blizzard Entertainment','Blizzard Entertainment','2010-07-27','',9.3),\n            ('Hearthstone','Digitales Kartenspiel basierend auf dem Warcraft-Universum, strategisches Deckbuilding und Online-K\u00E4mpfe.','card game','card-game,warcraft,strategy,collectible','PC,Mobile,Mac','Blizzard Entertainment','Blizzard Entertainment','2014-03-11','',8.7),\n            ('Paladins','Hero-Shooter mit verschiedenen Klassen, kooperativen Missionen und kompetitivem Spielmodus.','fps hero shooter','shooter,hero,team-based,action','PC,PS5,Xbox,Switch','Hi-Rez Studios','Hi-Rez Studios','2016-09-16','',8.4),\n            ('Factorio','Industrielles Aufbauspiel, Fabriken bauen, Ressourcen automatisieren und Produktionsketten optimieren.','simulation strategy','simulation,strategy,management','PC','Wube Software','Wube Software','2020-08-14','',9.0),\n            ('RimWorld','Kolonie-Simulation auf einem fremden Planeten, \u00DCberleben, Charaktermanagement und Storytelling.','simulation','management,simulation,indie,survival','PC','Ludeon Studios','Ludeon Studios','2018-10-17','',9.1),\n            ('Rainbow Six Siege','Taktischer Multiplayer-Shooter, Zerst\u00F6rung der Umgebung und Teamplay im Fokus.','fps tactical','shooter,tactical,multiplayer,competitive,team','PC,PS5,Xbox','Ubisoft','Ubisoft','2015-12-01','',9.0),\n            ('World of Warships','Online-PvP-Seeschlachten, Schiffsklassen, Strategie und taktisches Gameplay.','naval combat','strategy,multiplayer','PC','Wargaming','Wargaming','2015-09-17','',8.6),\n            ('For Honor','Nahkampf-Actionspiel mit mittelalterlichen Kriegern, Multiplayer- und Einzelspieler-Modi.','action fighting','action,medieval,multiplayer','PC,PS5,Xbox','Ubisoft','Ubisoft','2017-02-14','',8.7),\n            ('Far Cry 2','Open-World-Actionspiel in Afrika, realistische Schadensmechanik und dynamische Story.','fps open-world','shooter,open-world,action,story,adventure','PC,PS4,Xbox','Ubisoft','Ubisoft','2008-10-21','',8.3),\n            ('Far Cry 3','Open-World-Actionspiel mit Inselsetting, Crafting, Story-Entscheidungen und Stealth-Elementen.','fps open-world','shooter,open-world,action,story','PC,PS4,Xbox','Ubisoft','Ubisoft','2012-11-29','',9.0),\n            ('Far Cry 4','Open-World-Actionspiel in den Himalaya-Bergen, Erkundung, Quests und Waffenvielfalt.','fps open-world','shooter,open-world,action,exploration,story','PC,PS4,Xbox','Ubisoft','Ubisoft','2014-11-18','',8.9),\n            ('Far Cry 5','Open-World-Shooter in Montana, USA, Storymissionen, Multiplayer und Koop-Modus.','fps open-world','shooter,open-world,action,story','PC,PS4,Xbox','Ubisoft','Ubisoft','2018-03-27','',8.8),\n            ('Far Cry 6','Open-World-Actionspiel in fiktivem tropischen Setting, Story, Missionen und Fahrzeuge.','fps open-world','shooter,open-world,action,story','PC,PS5,Xbox','Ubisoft','Ubisoft','2021-10-07','',8.7),\n            ('Battlefield 3','First-Person-Shooter mit gro\u00DFen Multiplayer-Schlachten, Fahrzeugen und realistischem Gameplay.','fps','shooter,multiplayer,action','PC,PS4,Xbox','DICE','Electronic Arts','2011-10-25','',9.0),\n            ('Battlefield 4','Multiplayer-Shooter mit dynamischen Karten, Teamplay und realistischem Schadensmodell.','fps','shooter,multiplayer,action,team','PC,PS4,Xbox','DICE','Electronic Arts','2013-10-29','',8.8),\n            ('Call of Duty: Modern Warfare','Moderne Milit\u00E4r-Shooter-Serie mit Einzelspieler-Kampagne und Multiplayer-Modi.','fps','shooter,action,competitive','PC,PS4,Xbox','Infinity Ward','Activision','2019-10-25','',9.2),\n            ('God of War (2018)','Action-Adventure-Spiel mit nordischer Mythologie, epischer Story und K\u00E4mpfen.','action adventure','action,adventure,mythology,story','PC,PS4','Santa Monica Studio','Sony','2018-04-20','',9.5),\n            ('Horizon Zero Dawn','Open-World-Action-RPG mit Roboterdinosauriern, Crafting und Story-Entscheidungen.','action rpg','action,rpg,open-world,story','PC,PS4','Guerrilla Games','Sony','2017-02-28','',9.1),\n            ('Horizon Forbidden West','Fortsetzung von Horizon Zero Dawn, neue Welt, Story, Kampf gegen Maschinen und Erkundung.','action rpg','action,rpg,open-world,story,adventure','PC,PS5','Guerrilla Games','Sony','2022-02-18','',9.3),\n            ('Clair Obscur: Expedition 33', 'Clair Obscur: Expedition 33 ist ein preisgekr\u00F6ntes, von der Kritik gefeiertes Rollenspiel aus dem Jahr 2025, entwickelt von dem franz\u00F6sischen Studio Sandfall Interactive und ver\u00F6ffentlicht von Kepler Interactive. Das Spiel kombiniert eine tiefgr\u00FCndige narrative Struktur mit taktischen rundenbasierten K\u00E4mpfen, kunstvoller Belle\u2011\u00C9poque\u2011inspirierten Weltgestaltung und emotional aufgeladenen Charakterb\u00F6gen. Spieler begleiten eine Expedition gegen eine mysteri\u00F6se, \u00FCbernat\u00FCrliche Bedrohung in einer eindrucksvoll gestalteten Fantasy\u2011Welt, in der Licht\u2011 und Schattenmotivik als zentrales k\u00FCnstlerisches Thema dient. Clair Obscur erhielt zahlreiche Auszeichnungen, darunter Game of the Year 2025 bei den The Game Awards, Best Narrative, Best Art Direction und Best Score und wurde von Kritikern und Spielern f\u00FCr seine Story, Musik und visuelle Gestaltung gelobt. Das Spiel wurde am 24. April 2025 f\u00FCr PlayStation 5, Windows und Xbox Series X/S ver\u00F6ffentlicht und verkaufte bis Ende 2025 \u00FCber f\u00FCnf Millionen Einheiten.', 'role-playing', 'rpg,story,turn-based,fantasy', 'PC,PS5,Xbox', 'Sandfall Interactive', 'Kepler Interactive', '2025-04-24', '', 9.8);\n\n          INSERT OR IGNORE INTO achievements\n            (gameId, title, description, difficulty)\n          VALUES\n            (\n              (SELECT id FROM games WHERE title = 'Elden Ring'),\n              'Elden Lord',\n              'End the game and become the Elden Lord.',\n              'silver'\n            ),\n            (\n              (SELECT id FROM games WHERE title = 'Elden Ring'),\n              'Legendary Warrior',\n              'Kill 50 optional bosses.',\n              'gold'\n            ),\n            (\n              (SELECT id FROM games WHERE title = 'Elden Ring'),\n              'Rune Collector',\n              'Collect 1.000.000 runes.',\n              'platinum'\n            ),\n            (\n              (SELECT id FROM games WHERE title = 'The Witcher 3'),\n              'The Witcher',\n              'Complete all main story quests.',\n              'bronze'\n            ),\n            (\n              (SELECT id FROM games WHERE title = 'The Witcher 3'),\n              'Gwent-Master',\n              'Win all important Gwent tournaments.',\n              'platinum'\n            ),\n            (\n              (SELECT id FROM games WHERE title = 'The Witcher 3'),\n              'Monster Slayer',\n              'Kill 100 monsters.',\n              'bronze'\n            ),\n            (\n              (SELECT id FROM games WHERE title = 'Stardew Valley'),\n              'First Harvest',\n              'Harvest your first crop.',\n              'bronze'\n            ),\n            (\n              (SELECT id FROM games WHERE title = 'Stardew Valley'),\n              'Community Helper',\n              'Complete the Community Center.',\n              'silver'\n            ),\n            (\n              (SELECT id FROM games WHERE title = 'Stardew Valley'),\n              'Farming Pro',\n              'Reach level 10 in Farming skill.',\n              'gold'\n            ),\n            (\n              (SELECT id FROM games WHERE title = 'Stardew Valley'),\n              'Millionaire',\n              'Earn 1,000,000 gold.',\n              'platinum'\n            ),\n            (\n              (SELECT id FROM games WHERE title = 'Hades'),\n              'Escape Artist',\n              'Escape the Underworld for the first time.',\n              'bronze'\n            ),\n            (\n              (SELECT id FROM games WHERE title = 'Hades'),\n              'Godslayer',\n              'End the game completely.',\n              'gold'\n            ),\n            (\n              (SELECT id FROM games WHERE title = 'Hades'),\n              'olympian Favor',\n              'Receive blessings from all Olympian gods.',\n              'platinum'\n            ),\n            (\n              (SELECT id FROM games WHERE title = 'Minecraft'),\n              'Woodworker',\n              'Collect your first block of wood.',\n              'bronze'\n            ),\n            (\n              (SELECT id FROM games WHERE title = 'Minecraft'),\n              'The End',\n              'Defeat the Ender Dragon.',\n              'platinum'\n            ),\n            (\n              (SELECT id FROM games WHERE title = 'Minecraft'),\n              'Redstone-Engineer',\n              'Build a complex Redstone machine.',\n              'silver'\n            );\n\n          INSERT OR IGNORE INTO users\n            (name, email, passwordHash, profilePicturePath)\n          VALUES\n            (\n              'sa',\n              'sa@test.de',\n              '4cf6829aa93728e8f3c97df913fb1bfa95fe5810e2933a05943f8312a98d9cf2', --sa\n              'TODO'\n            ),\n            (\n              'test',\n              'test@test.de',\n              '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', --test\n              'TODO'\n            );\n\n          INSERT OR IGNORE INTO guides \n            (userId, gameId, title, content, pdfPath, createdAt)\n          VALUES\n            (\n              (SELECT id FROM users WHERE name = 'sa'), \n              (SELECT id FROM games WHERE title = 'Elden Ring'), \n              'Beginner Guide', \n              'Elden Ring ist ein riesiges Open-World-Action-RPG. In diesem Guide behandeln wir die grundlegenden Spielmechaniken, wie das Bewegen, K\u00E4mpfen und Leveln. Au\u00DFerdem geben wir Tipps f\u00FCr die ersten Gebiete, wie man Ressourcen effizient nutzt, erste Bosse besiegt und Fallen vermeidet. Spieler lernen, welche Klassen f\u00FCr den Einstieg geeignet sind, wie man die Karte optimal erkundet und welche NPCs hilfreich sind. Der Guide geht auch auf Waffen, Magie und Buffs ein, damit Anf\u00E4nger nicht frustriert werden.', \n              'TODO', \n              datetime('now')\n            ),\n            (\n              (SELECT id FROM users WHERE name = 'test'), \n              (SELECT id FROM games WHERE title = 'Elden Ring'), \n              'Boss Guide', \n              'Dieser Guide konzentriert sich auf die gro\u00DFen Bossk\u00E4mpfe in Elden Ring. Wir geben Schritt-f\u00FCr-Schritt-Anleitungen f\u00FCr die Taktiken gegen die wichtigsten Bosse der ersten Spielregionen. Dabei werden Angriffsmuster, Schw\u00E4chen und empfohlene Ausr\u00FCstung beschrieben. Au\u00DFerdem Tipps zu Summons, Coop-Mechaniken und wie man Bosskampffrust reduziert, damit der Fortschritt fl\u00FCssig bleibt.', \n              'TODO', \n              datetime('now')\n            ),\n            (\n              (SELECT id FROM users WHERE name = 'sa'), \n              (SELECT id FROM games WHERE title = 'Elden Ring'), \n              'Secrets & Easter Eggs', \n              'Dieser Guide deckt geheime Orte, versteckte Bosse und seltene Items in Elden Ring ab. Wir zeigen, wie man versteckte Pfade entdeckt, welche NPC-Quests zu besonderen Belohnungen f\u00FChren, und wie man geheime Skills und Waffen freischaltet. Au\u00DFerdem Hinweise zu Easter Eggs, die Anspielungen auf andere Spiele enthalten. Spieler erhalten hier wertvolle Hinweise, um das Spiel vollst\u00E4ndig zu erkunden.', \n              'TODO', \n              datetime('now')\n            ),\n            (\n              (SELECT id FROM users WHERE name = 'sa'), \n              (SELECT id FROM games WHERE title = 'The Witcher 3'), \n              'Main Story Walkthrough', \n              'Dieser Guide behandelt die Hauptquests von The Witcher 3: Wild Hunt. Wir f\u00FChren den Spieler durch alle Kapitel und zeigen, wie man Entscheidungen trifft, die Einfluss auf das Spielende haben. Dazu Tipps zu K\u00E4mpfen, Hexer-Zeichen, Tr\u00E4nken und Ausr\u00FCstung. Au\u00DFerdem behandeln wir die wichtigsten Story-Entscheidungen, um die maximale Erfahrung und bestm\u00F6gliche Belohnungen zu erhalten.', \n              'TODO', \n              datetime('now')\n            ),\n            (\n              (SELECT id FROM users WHERE name = 'sa'), \n              (SELECT id FROM games WHERE title = 'The Witcher 3'), \n              'Gwent Strategy Guide', \n              'Ein umfassender Guide zum Kartenspiel Gwent in The Witcher 3. Hier erf\u00E4hrt man, wie man die besten Decks zusammenstellt, Gegner analysiert und Karten effizient sammelt. Wir erkl\u00E4ren die Spielmechanik, Strategien gegen spezielle Gegner und geben Tipps f\u00FCr Turniere in Novigrad und Kaer Morhen.', \n              'TODO', \n              datetime('now')\n            ),\n            (\n              (SELECT id FROM users WHERE name = 'test'), \n              (SELECT id FROM games WHERE title = 'Hades'), \n              'Beginner Hades Guide', \n              'Hades ist ein roguelike Dungeon-Crawler. In diesem Guide erfahren Anf\u00E4nger, wie man die ersten Runs \u00FCberlebt, welche Waffen sich f\u00FCr den Einstieg eignen, wie man die G\u00F6tterboons sinnvoll kombiniert und welche Upgrades langfristig helfen. Au\u00DFerdem Tipps zu Heilung, Gegnergruppen und Bossen in den ersten Leveln. Ziel ist es, den Spieler optimal auf sp\u00E4tere, schwierigere Runs vorzubereiten.', \n              'TODO', \n              datetime('now')\n            ),\n            (\n              (SELECT id FROM users WHERE name = 'test'), \n              (SELECT id FROM games WHERE title = 'Hades'), \n              'Advanced Hades Tactics', \n              'Dieser Guide richtet sich an erfahrene Spieler von Hades. Wir analysieren die fortgeschrittenen Builds, synergistische Boons, die optimalen Waffen und die beste Strategie gegen die finalen Bosse. Au\u00DFerdem geben wir Hinweise zu seltenen Upgrades, Chamber-Kompositionen und Geheimnissen in der Unterwelt, um maximale Highscores zu erreichen.', \n              'TODO', \n              datetime('now')\n            );\n        ")];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.initDB = function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.setupDatabase()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.createInitialData()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.executeSQL = function (sql_1) {
            var args_1 = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args_1[_i - 1] = arguments[_i];
            }
            return __awaiter(_this, __spreadArray([sql_1], args_1, true), void 0, function (sql, params, single) {
                var db, result, _a, err_1;
                if (params === void 0) { params = []; }
                if (single === void 0) { single = false; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.openDB()];
                        case 1:
                            db = _b.sent();
                            return [4 /*yield*/, db.exec("PRAGMA foreign_keys = ON;")];
                        case 2:
                            _b.sent();
                            _b.label = 3;
                        case 3:
                            _b.trys.push([3, 11, 12, 14]);
                            if (!sql.trim().toUpperCase().startsWith('SELECT')) return [3 /*break*/, 8];
                            if (!single) return [3 /*break*/, 5];
                            return [4 /*yield*/, db.get(sql, params)];
                        case 4:
                            _a = _b.sent();
                            return [3 /*break*/, 7];
                        case 5: return [4 /*yield*/, db.all(sql, params)];
                        case 6:
                            _a = _b.sent();
                            _b.label = 7;
                        case 7:
                            result = _a;
                            return [3 /*break*/, 10];
                        case 8: return [4 /*yield*/, db.run(sql, params)];
                        case 9:
                            result = _b.sent();
                            _b.label = 10;
                        case 10: return [3 /*break*/, 14];
                        case 11:
                            err_1 = _b.sent();
                            throw err_1;
                        case 12: return [4 /*yield*/, db.close()];
                        case 13:
                            _b.sent();
                            return [7 /*endfinally*/];
                        case 14: return [2 /*return*/, result];
                    }
                });
            });
        };
    }
    return Db;
}());
exports.Db = Db;
