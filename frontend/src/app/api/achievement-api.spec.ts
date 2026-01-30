import { TestBed } from '@angular/core/testing';

import { AchievementApi } from './achievement-api';

describe('Achievement', () => {
    let service: AchievementApi;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AchievementApi);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
