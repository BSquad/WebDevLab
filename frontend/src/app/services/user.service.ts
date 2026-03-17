import { Injectable, inject } from '@angular/core';
import { UserApi } from '../api/user-api';
import { AnalysisData } from '../../../../shared/models/analysisData';

interface Response {
    body: ReadableStream<Uint8Array> | null;
}

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private userApi = inject(UserApi);

    async getUserProfile(userId: number) {
        return this.userApi.getUserProfile(userId);
    }

    async updateUser(userId: number, formData: FormData): Promise<void> {
        return this.userApi.updateUser(userId, formData);
    }

    async getGames(userId: number) {
        return this.userApi.getGames(userId);
    }

    async getAchievements(userId: number) {
        return this.userApi.getAchievements(userId);
    }

    async getGuides(userId: number) {
        return this.userApi.getGuides(userId);
    }

    async startUserAnalysis(
        userId: number,
        onProgress?: (progress: number) => void,
    ): Promise<AnalysisData> {
        const response = await this.userApi.startUserAnalysis(userId);
        return await this.processStreamResponse(response, onProgress);
    }

    private async processStreamResponse(
        response: Response,
        onProgress?: (progress: number) => void,
    ): Promise<AnalysisData> {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let streamBuffer = '';
        let analysisResult: AnalysisData | null = null;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            streamBuffer += decoder.decode(value, { stream: true });
            const { parsedLines, remainingBuffer } = this.extractLinesFromBuffer(streamBuffer);
            streamBuffer = remainingBuffer;

            for (const line of parsedLines) {
                const parsedData = this.parseAnalysisLine(line);
                if (typeof parsedData === 'number' && onProgress) {
                    onProgress(parsedData);
                } else if (typeof parsedData === 'object') {
                    analysisResult = parsedData;
                }
            }
        }

        return analysisResult || this.parseRemainingBuffer(streamBuffer);
    }

    private extractLinesFromBuffer(buffer: string): {
        parsedLines: string[];
        remainingBuffer: string;
    } {
        const lines = buffer.split('\n');
        const remainingBuffer = lines.pop() || '';
        return { parsedLines: lines, remainingBuffer };
    }

    private parseAnalysisLine(line: string): number | AnalysisData | null {
        const trimmedLine = line.trim();
        const progressValue = parseInt(trimmedLine);
        return !isNaN(progressValue)
            ? progressValue
            : trimmedLine.startsWith('{')
              ? JSON.parse(trimmedLine)
              : null;
    }

    private parseRemainingBuffer(buffer: string): AnalysisData {
        return buffer.trim().startsWith('{')
            ? JSON.parse(buffer.trim())
            : (() => {
                  throw new Error('No analysis data received');
              })();
    }
}
