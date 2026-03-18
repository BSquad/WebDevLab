import type { Request, Response } from 'express';
import { UserService } from '../services/user-service.js';
import { GameService } from '../services/game-service.js';
import { GuideService } from '../services/guide-service.js';
import { HttpError } from '../utils/HttpError.js';

export class UserController {
    private userService = new UserService();
    private gameService = new GameService();
    private guideService = new GuideService();

    getUser = async (req: Request, res: Response): Promise<void> => {
        const userId = Number(req.params.id);
        if (Number.isNaN(userId)) throw new HttpError('Invalid User ID', 400);

        const user = await this.userService.getUserById(userId);
        if (!user) throw new HttpError('User not found', 404);

        res.status(200).json(user);
    };

    updateUser = async (req: Request, res: Response): Promise<void> => {
        const userId = Number(req.params.id);
        if (Number.isNaN(userId)) throw new HttpError('Invalid User ID', 400);

        const { name, email } = req.body;
        if (!name || !email)
            throw new HttpError('Name and email are required', 400);

        const currentUser = await this.userService.getUserById(userId);
        if (!currentUser) throw new HttpError('User not found', 404);

        let profilePath = currentUser.profilePicturePath;
        if (req.file) {
            profilePath = `/uploads/images/user/${req.file.filename}`;
        }

        await this.userService.updateUser(userId, name, email, profilePath);

        res.status(200).json({ message: 'User updated successfully' });
    };

    updateLayout = async (req: Request, res: Response): Promise<void> => {
        const userId = Number(req.params.id);
        if (Number.isNaN(userId)) throw new HttpError('Invalid User ID', 400);

        const { order } = req.body;
        if (!Array.isArray(order))
            throw new HttpError('Layout order must be an array', 400);

        await this.userService.updateLayout(userId, order);

        res.status(200).json({ message: 'Layout updated successfully' });
    };

    deleteUser = async (req: Request, res: Response): Promise<void> => {
        const userId = Number(req.params.id);
        if (Number.isNaN(userId)) throw new HttpError('Invalid User ID', 400);

        // Optional: Check if user exists before deleting
        const user = await this.userService.getUserById(userId);
        if (!user) throw new HttpError('User not found', 404);

        await this.userService.deleteUser(userId);
        res.status(200).json({ message: 'User deleted successfully' });
    };

    getUserProfile = async (req: Request, res: Response): Promise<void> => {
        const userId = Number(req.params.id);
        if (Number.isNaN(userId)) throw new HttpError('Invalid User ID', 400);

        const profile = await this.userService.getFullProfile(userId);
        if (!profile) throw new HttpError('User profile not found', 404);

        res.status(200).json(profile);
    };

    getGames = async (req: Request, res: Response): Promise<void> => {
        const userId = Number(req.params.id);
        if (Number.isNaN(userId)) throw new HttpError('Invalid User ID', 400);

        const data = await this.gameService.getGamesByUserId(userId);
        res.status(200).json(data);
    };

    getAchievements = async (req: Request, res: Response): Promise<void> => {
        const userId = Number(req.params.id);
        if (Number.isNaN(userId)) throw new HttpError('Invalid User ID', 400);

        const data = await this.gameService.getAchievementsByUserId(userId);
        res.status(200).json(data);
    };

    getGuides = async (req: Request, res: Response): Promise<void> => {
        const guideId = Number(req.params.id);
        if (Number.isNaN(guideId)) throw new HttpError('Invalid Guide ID', 400);

        const data = await this.guideService.getGuideById(guideId);
        if (!data) throw new HttpError('Guide not found', 404);

        res.status(200).json(data);
    };

    startUserAnalysis = async (req: Request, res: Response): Promise<void> => {
        const userId = Number(req.body?.userId);
        if (Number.isNaN(userId) || !userId)
            throw new HttpError('Valid User ID required in body', 400);

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
