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
    });
});
