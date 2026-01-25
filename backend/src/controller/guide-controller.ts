import type { Request, Response } from 'express';
import { GuideService } from '../services/guide-service.ts';
import type { Guide } from '../../../shared/models/guide.ts';


export class GuideController {
  private guideService: GuideService = new GuideService();

  createGuide = async (req: Request, res: Response) => {
    const guide = req.body as Guide;
    await this.guideService.createGuide(guide);
    res.json(true);
  }
}