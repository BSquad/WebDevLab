import { TestBed } from '@angular/core/testing';

import { GuideApi } from './guide-api';

describe('GuideApi', () => {
  let service: GuideApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuideApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
