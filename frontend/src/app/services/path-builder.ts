import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PathBuilder {
  private readonly baseApiUrl = 'http://localhost:3000';
 
  getGameImagePath(imageFileName?: string): string {
    if (!imageFileName) {
      return `${this.baseApiUrl}/images/games/questionmark.webp`;
    }
    return `${this.baseApiUrl}/images/games/${imageFileName}`;
  }
}

