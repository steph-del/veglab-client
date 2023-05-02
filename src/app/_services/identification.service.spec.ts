import { TestBed } from '@angular/core/testing';

import { IdentificationService } from './identification.service';

describe('IdentificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IdentificationService = TestBed.get(IdentificationService);
    expect(service).toBeTruthy();
  });
});
