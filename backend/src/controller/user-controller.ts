import type { Request, Response } from 'express';
import { UserService } from '../services/user-service.js';

export class UserController {
    private userService: UserService = new UserService();

    startUserAnalysis = async (req: Request, res: Response) => {
        const userId = Number(req.body.userId);
        const analysisData = await this.userService.startUserAnalysis(userId);
        console.log(analysisData);
        res.json(analysisData);
    };
}
