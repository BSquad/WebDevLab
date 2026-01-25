import { Db } from '../db.ts';
import type { Guide } from '../../../shared/models/guide.ts';

export class GuideDbAccess {
  private db: Db = new Db();

  addGuide = async (guide: Guide) => {
    await this.db.executeSQL(
      `INSERT INTO GUIDES (AUTHORID, GAMEID, TITLE, CONTENT, CREATEDAT) VALUES (?, ?, ?, ?, datetime('now'))`,
      [guide.authorId, guide.gameId, guide.title, guide.content]
    );
  }
}
