"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameDbAccess = void 0;
var db_js_1 = require("../db.js");
var GameDbAccess = /** @class */ (function () {
    function GameDbAccess() {
        var _this = this;
        this.db = new db_js_1.Db();
        this.getGames = function (userId) { return __awaiter(_this, void 0, void 0, function () {
            var games;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.executeSQL("\n            SELECT \n              g.*,\n              CASE WHEN ug.userId IS NOT NULL THEN 1 ELSE 0 END AS isTracked,\n              COALESCE(ug.isFavorite, 0) AS isFavourite,\n              (SELECT COUNT(*) FROM achievements a WHERE a.gameId = g.id) AS achievementCount\n            FROM games g\n            LEFT JOIN user_games ug\n              ON g.id = ug.gameId AND ug.userId = ?\n          ", [userId !== null && userId !== void 0 ? userId : -1])];
                    case 1:
                        games = (_a.sent());
                        return [2 /*return*/, games.map(function (game) { return (__assign(__assign({}, game), { tags: _this.splitStringToArray(game.tags), platform: _this.splitStringToArray(game.platform), isTracked: Boolean(game.isTracked), isFavourite: Boolean(game.isFavourite) })); })];
                }
            });
        }); };
        this.getGameById = function (gameId, userId) { return __awaiter(_this, void 0, void 0, function () {
            var game;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.executeSQL("\n            SELECT \n              g.*,\n              CASE WHEN ug.userId IS NOT NULL THEN 1 ELSE 0 END AS isTracked,\n              COALESCE(ug.isFavorite, 0) AS isFavourite,\n              (SELECT COUNT(*) FROM achievements a WHERE a.gameId = g.id) AS achievementCount\n            FROM games g\n            LEFT JOIN user_games ug\n              ON g.id = ug.gameId AND ug.userId = ?\n            WHERE g.id = ?\n          ", [userId !== null && userId !== void 0 ? userId : -1, gameId], true)];
                    case 1:
                        game = _a.sent();
                        return [2 /*return*/, __assign(__assign({}, game), { tags: this.splitStringToArray(game.tags), platform: this.splitStringToArray(game.platform), isTracked: Boolean(game.isTracked), isFavourite: Boolean(game.isFavourite) })];
                }
            });
        }); };
        this.getAchievementsByGameId = function (gameId, userId) { return __awaiter(_this, void 0, void 0, function () {
            var achievements;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.executeSQL("\n            SELECT \n              a.*, \n              CASE WHEN ua.userId IS NOT NULL THEN 1 ELSE 0 END AS isCompleted\n            FROM achievements a\n            LEFT JOIN user_achievements ua \n              ON a.id = ua.achievementId AND ua.userId = ?\n            WHERE a.gameId = ?\n          ", [userId !== null && userId !== void 0 ? userId : -1, gameId])];
                    case 1:
                        achievements = (_a.sent());
                        return [2 /*return*/, achievements.map(function (a) { return (__assign(__assign({}, a), { isCompleted: Boolean(a.isCompleted) })); })];
                }
            });
        }); };
        this.completeAchievement = function (achievementId, userId, gameId) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.executeSQL("INSERT INTO USER_ACHIEVEMENTS (userId, achievementId, gameId, completedAt) VALUES (?, ?, ?, datetime('now'))", [userId, achievementId, gameId])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.trackGame = function (gameId, userId) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.executeSQL("INSERT OR IGNORE INTO USER_GAMES (userId, gameId, isFavorite, addedAt) VALUES (?, ?, 0, datetime('now'))", [userId, gameId])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.unTrackGame = function (gameId, userId) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.executeSQL("DELETE FROM USER_GAMES WHERE userId = ? AND gameId = ?", [userId, gameId])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        this.getBestUsersByGameId = function (gameId) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.executeSQL("\n            SELECT u.id, u.name, u.email, COUNT(ua.achievementId) AS achievementCount\n            FROM user_achievements ua\n            LEFT JOIN users u ON u.id = ua.userId\n            WHERE ua.gameId = ?\n            GROUP BY u.id, u.name, u.email\n            ORDER BY achievementCount DESC\n            LIMIT 10\n          ", [gameId])];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        }); };
        this.splitStringToArray = function (text) {
            if (!text)
                return [];
            return text
                .split(',')
                .map(function (v) { return v.trim(); })
                .filter(Boolean);
        };
    }
    GameDbAccess.prototype.getPopularGames = function () {
        return __awaiter(this, void 0, void 0, function () {
            var sql;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sql = "\n          SELECT\n            ga.*,\n            ga.popularityScore\n              + (COUNT(DISTINCT ug.userId) * 0.5)\n              + (COUNT(DISTINCT ua.userId) * 0.3) \n              + (COUNT(DISTINCT gu.userId) * 0.7) AS combinedScore\n          FROM games ga\n          LEFT JOIN user_games ug\n            ON ug.gameId = ga.id\n            AND ug.addedAt >= datetime('now', '-30 days')\n          LEFT JOIN user_achievements ua\n            ON ua.gameId = ga.id\n            AND ua.completedAt >= datetime('now', '-30 days')\n          LEFT JOIN guides gu\n            ON gu.gameId = ga.id\n            AND gu.createdAt >= datetime('now', '-30 days')\n          GROUP BY ga.id\n          ORDER BY combinedScore DESC\n          LIMIT 8\n        ";
                        return [4 /*yield*/, this.db.executeSQL(sql)];
                    case 1: return [2 /*return*/, (_a.sent())];
                }
            });
        });
    };
    return GameDbAccess;
}());
exports.GameDbAccess = GameDbAccess;
