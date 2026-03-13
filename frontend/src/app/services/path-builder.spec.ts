import { TestBed } from '@angular/core/testing';
import { PathBuilder } from './path-builder';

describe('PathBuilder', () => {
    let service: PathBuilder;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PathBuilder);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
        expect(service['baseApiUrl']).toBe('http://localhost:3000');
    });

    describe('getGameImagePath', () => {
        it('should return default image path when no filename provided', () => {
            const result = service.getGameImagePath();

            expect(result).toBe('http://localhost:3000/uploads/images/games/questionmark.webp');
        });

        it('should return custom image path when filename provided', () => {
            const result = service.getGameImagePath('test-game.jpg');

            expect(result).toBe('http://localhost:3000/uploads/images/games/test-game.jpg');
        });

        it('should handle empty string filename', () => {
            const result = service.getGameImagePath('');

            expect(result).toBe('http://localhost:3000/uploads/images/games/questionmark.webp');
        });

        it('should handle special characters in filename', () => {
            const result = service.getGameImagePath('game-with-special@chars.png');

            expect(result).toBe(
                'http://localhost:3000/uploads/images/games/game-with-special@chars.png',
            );
        });

        it('should handle unicode characters in filename', () => {
            const result = service.getGameImagePath('söme-gäme.jpg');

            expect(result).toBe('http://localhost:3000/uploads/images/games/söme-gäme.jpg');
        });
    });
});
