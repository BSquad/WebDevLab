import type { Response } from 'express';

export class BaseController {
  handleRequest = async<T>(
    res: Response,
    callback: () => Promise<T>,
  ) => {
    try {
      const data = await callback();
      res.json({ success: true, data });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ success: false, data: null, error: 'Server error' });
    }
  }
} 
