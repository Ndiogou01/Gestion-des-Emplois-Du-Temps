import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiliereCoursForm } from './filiere-cours-form';

describe('FiliereCoursForm', () => {
  let component: FiliereCoursForm;
  let fixture: ComponentFixture<FiliereCoursForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiliereCoursForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiliereCoursForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
