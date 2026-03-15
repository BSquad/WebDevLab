import type { Request, Response } from 'express';
import { UserService } from '../services/user-service.js';
import { GameService } from '../services/game-service.js';
import { GuideService } from '../services/guide-service.js';

export class UserController {
    // TypeScript automatically infers the types here
    private userService = new UserService();
    private gameService = new GameService();
    private guideService = new GuideService();

    getUser = async (req: Request, res: Response): Promise<void> => {
        const user = await this.userService.getUserById(Number(req.params.id));
        res.status(200).json(user);
    };

    updateUser = async (req: Request, res: Response): Promise<void> => {
        const userId = Number(req.params.id);
        const { name, email } = req.body;

        //get the current user to keep the old path if no new pciture is uploaded
        const currentUser = await this.userService.getUserById(userId);
        let profilePath = currentUser.profilePicturePath;

        if (req.file) {
            profilePath = `/uploads/images/user/${req.file.filename}`;
        }

        await this.userService.updateUser(userId, name, email, profilePath);

        res.status(200).json({
            message: 'User updated',
        });
    };

    deleteUser = async (req: Request, res: Response): Promise<void> => {
        await this.userService.deleteUser(Number(req.params.id));
        res.status(200).json({ message: 'User deleted' });
    };

    getUserProfile = async (req: Request, res: Response): Promise<void> => {
        const userId = Number(req.params.id);

        if (Number.isNaN(userId)) {
            res.status(400).json({ error: 'Invalid User ID' });
            return;
        }

        const profile = await this.userService.getFullProfile(userId);
        res.status(200).json(profile);
    };

    getGames = async (req: Request, res: Response): Promise<void> => {
        const data = await this.gameService.getGamesByUserId(
            Number(req.params.id),
        );
        res.json(data);
    };

    getAchievements = async (req: Request, res: Response): Promise<void> => {
        const data = await this.gameService.getAchievementsByUserId(
            Number(req.params.id),
        );
        res.json(data);
    };

    getGuides = async (req: Request, res: Response): Promise<void> => {
        const data = await this.guideService.getGuideById(
            Number(req.params.id),
        );
        res.json(data);
    };

    startUserAnalysis = async (req: Request, res: Response): Promise<void> => {
        const userId = Number(req.body?.userId);

        await this.streamAnalysisProgress(res);
        await this.sendFinalAnalysisData(res, userId);
    };

    private async streamAnalysisProgress(res: Response): Promise<void> {
        const totalSteps = 10;

        for (let step = 1; step <= totalSteps; step++) {
            const progress = Math.round((step / totalSteps) * 100);
            res.write(`${progress}\n`);

            await this.flushResponse(res);
            await this.delay(1000);
        }
    }

    private async flushResponse(res: Response): Promise<void> {
        await new Promise<void>((resolve) =>
            setTimeout(() => {
                if ((res as any).flush) (res as any).flush();
                else if ((res as any).socket?.flush)
                    (res as any).socket.flush();
                resolve();
            }, 0),
        );
    }

    private async delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    private async sendFinalAnalysisData(
        res: Response,
        userId: number,
    ): Promise<void> {
        const analysisData = await this.userService.startUserAnalysis(userId);
        res.write(JSON.stringify(analysisData));
        res.end();
    }
}
