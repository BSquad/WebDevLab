import { TestBed } from '@angular/core/testing';

import { LoadParticipiants } from './load-participiants';

describe('LoadParticipiants', () => {
  let service: LoadParticipiants;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadParticipiants);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
