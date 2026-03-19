import type { Request, Response } from 'express';
import { UserService } from '../services/user-service.js';
import { GameService } from '../services/game-service.js';
import { GuideService } from '../services/guide-service.js';
import createError from 'http-errors';

export class UserController {
    private userService = new UserService();
    private gameService = new GameService();
    private guideService = new GuideService();

    getUser = async (req: Request, res: Response): Promise<void> => {
        const userId = Number(req.params.id);
        if (Number.isNaN(userId)) throw createError(400, 'Invalid userId');

        const user = await this.userService.getUserById(userId);
        if (!user) throw createError(404, 'User not found');

        res.status(200).json(user);
    };

    updateUser = async (req: Request, res: Response): Promise<void> => {
        const userId = Number(req.params.id);
        if (Number.isNaN(userId)) throw createError(400, 'Invalid userId');

        const { name, email } = req.body;
        if (!name || !email)
            throw createError(400, 'Name and email are required');

        const currentUser = await this.userService.getUserById(userId);
        if (!currentUser) throw createError(404, 'User not found');

        let profilePath = currentUser.profilePicturePath;
        if (req.file) {
            profilePath = `/uploads/images/user/${req.file.filename}`;
        }

        await this.userService.updateUser(userId, name, email, profilePath);

        res.status(200).json({ message: 'User updated successfully' });
    };

    updateLayout = async (req: Request, res: Response): Promise<void> => {
        const userId = Number(req.params.id);
        if (Number.isNaN(userId)) throw createError(400, 'Invalid userId');

        const { order } = req.body;
        if (!Array.isArray(order))
            throw createError(400, 'Layout order must be an array');

        await this.userService.updateLayout(userId, order);

        res.status(200).json({ message: 'Layout updated successfully' });
    };

    deleteUser = async (req: Request, res: Response): Promise<void> => {
        const userId = Number(req.params.id);
        if (Number.isNaN(userId)) throw createError(400, 'Invalid userId');

        const user = await this.userService.getUserById(userId);
        if (!user) throw createError(404, 'User not found');

        await this.userService.deleteUser(userId);
        res.status(200).json({ message: 'User deleted successfully' });
    };

    getUserProfile = async (req: Request, res: Response): Promise<void> => {
        const userId = Number(req.params.id);
        if (Number.isNaN(userId)) throw createError(400, 'Invalid userId');

        const profile = await this.userService.getFullProfile(userId);
        if (!profile) throw createError(404, 'User profile not found');

        res.status(200).json(profile);
    };

    getGames = async (req: Request, res: Response): Promise<void> => {
        const userId = Number(req.params.id);
        if (Number.isNaN(userId)) throw createError(400, 'Invalid userId');

        const data = await this.gameService.getGamesByUserId(userId);
        res.status(200).json(data);
    };

    getAchievements = async (req: Request, res: Response): Promise<void> => {
        const userId = Number(req.params.id);
        if (Number.isNaN(userId)) throw createError(400, 'Invalid userId');

        const data = await this.gameService.getAchievementsByUserId(userId);
        res.status(200).json(data);
    };

    getGuides = async (req: Request, res: Response): Promise<void> => {
        const userId = Number(req.params.id);
        if (Number.isNaN(userId)) throw createError(400, 'Invalid userId');

        const data = await this.guideService.getGuidesByUserId(userId);

        res.status(200).json(data);
    };

    startUserAnalysis = async (req: Request, res: Response): Promise<void> => {
        const userId = Number(req.body?.userId);
        if (Number.isNaN(userId) || !userId)
            throw createError(400, 'Valid userId required in body');

        try {
            await this.streamAnalysisProgress(res);
            await this.sendFinalAnalysisData(res, userId);
        } catch (err) {
            console.error(err);

            if (!res.headersSent) {
                throw err;
            }

            res.end();
        }
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

        if (!analysisData) {
            res.write(
                JSON.stringify({ error: 'User analysis failed to generate.' }),
            );
            res.end();
            return;
        }

        res.write(JSON.stringify(analysisData));
        res.end();
    }
}
