import { TestBed } from '@angular/core/testing';

import { FiliereCoursService } from './filiere-cours';

describe('FiliereCours', () => {
  let service: FiliereCoursService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FiliereCoursService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
