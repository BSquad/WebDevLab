import type { Guide } from "../../../shared/models/guide.ts";
import { GuideDbAccess } from "../db-access/guide-db-access.ts";

export class GuideService {
  private guideDbAccess: GuideDbAccess = new GuideDbAccess();

  createGuide = async (guide: Guide) => {
    await this.guideDbAccess.addGuide(guide);
  }
}