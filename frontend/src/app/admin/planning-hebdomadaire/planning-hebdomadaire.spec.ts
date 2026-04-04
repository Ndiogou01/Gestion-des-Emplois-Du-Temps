import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningHebdomadaire } from './planning-hebdomadaire';

describe('PlanningHebdomadaire', () => {
  let component: PlanningHebdomadaire;
  let fixture: ComponentFixture<PlanningHebdomadaire>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanningHebdomadaire]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanningHebdomadaire);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
