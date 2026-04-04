import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningGrid } from './planning-grid';

describe('PlanningGrid', () => {
  let component: PlanningGrid;
  let fixture: ComponentFixture<PlanningGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanningGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanningGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
