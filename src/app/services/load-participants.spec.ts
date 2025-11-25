import { TestBed } from '@angular/core/testing';

import { LoadParticipants } from './load-participiants';

describe('LoadParticipants', () => {
  let service: LoadParticipants;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadParticipants);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
