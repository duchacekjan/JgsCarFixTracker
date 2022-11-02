import { TestBed } from '@angular/core/testing';

import { FixesService } from './fixes.service';

describe('FixesService', () => {
  let service: FixesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FixesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
