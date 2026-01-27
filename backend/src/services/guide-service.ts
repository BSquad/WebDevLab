import type { Guide } from "../../../shared/models/guide.ts";
import { GuideDbAccess } from "../db-access/guide-db-access.js";

export class GuideService {
  private guideDbAccess: GuideDbAccess = new GuideDbAccess();

  createGuide = async (guide: Guide) => {
    await this.guideDbAccess.addGuide(guide);
  }

  getGuidesByGameId = async (gameId: number): Promise<Guide[]> => {
    return await this.guideDbAccess.getGuidesByGameId(gameId);
  }
}