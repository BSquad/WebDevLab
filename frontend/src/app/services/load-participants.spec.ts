import { TestBed } from '@angular/core/testing';

import { LoadParticipants } from './load-participants';

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
