import type { Request, Response } from 'express';
import { UserService } from '../services/user-service.js';
import { GameService } from '../services/game-service.js';
import { GuideService } from '../services/guide-service.js';

export class UserController {
    private userService: UserService = new UserService();
    private gameService: GameService = new GameService();
    private guideService: GuideService = new GuideService();

    getUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const user = await this.userService.getUserById(
                Number(req.params.id),
            );
            res.status(200).json(user);
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    };

    updateUser = async (req: Request, res: Response): Promise<void> => {
        try {
            await this.userService.updateUser(
                Number(req.params.id),
                req.body.name,
                req.body.email,
            );
            res.status(200).json({ message: 'User updated' });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    deleteUser = async (req: Request, res: Response): Promise<void> => {
        try {
            await this.userService.deleteUser(Number(req.params.id));
            res.status(200).json({ message: 'User deleted' });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    getUserProfile = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = Number(req.params.id);

            if (isNaN(userId)) {
                res.status(400).json({ error: 'Invalid User ID' });
                return;
            }

            const profile = await this.userService.getFullProfile(userId);
            res.status(200).json(profile);
        } catch (error: any) {
            console.error(error);
            res.status(500).json({
                error: error.message || 'Internal Server Error',
            });
        }
    };

    getGames = async (req: Request, res: Response) => {
        const data = await this.gameService.getGamesByUserId(
            Number(req.params.id),
        );
        res.json(data);
    };

    getAchievements = async (req: Request, res: Response) => {
        const data = await this.gameService.getAchievementsByUserId(
            Number(req.params.id),
        );
        res.json(data);
    };

    getGuides = async (req: Request, res: Response) => {
        const data = await this.guideService.getGuidesByUserId(
            Number(req.params.id),
        );
        res.json(data);
    };

    startUserAnalysis = async (req: Request, res: Response) => {
        const userId = Number(req.body.userId);
        const analysisData = await this.userService.startUserAnalysis(userId);
        console.log(analysisData);
        res.json(analysisData);
    };
}
