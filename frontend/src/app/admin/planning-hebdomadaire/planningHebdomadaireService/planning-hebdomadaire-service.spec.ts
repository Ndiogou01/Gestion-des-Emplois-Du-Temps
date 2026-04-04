import { TestBed } from '@angular/core/testing';

import { PlanningHebdomadaireService } from './planning-hebdomadaire-service';

describe('PlanningHebdomadaireService', () => {
  let service: PlanningHebdomadaireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanningHebdomadaireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
