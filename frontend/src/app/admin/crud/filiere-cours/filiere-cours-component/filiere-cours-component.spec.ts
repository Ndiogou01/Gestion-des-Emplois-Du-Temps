import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiliereCoursComponent } from './filiere-cours-component';

describe('FiliereCoursComponent', () => {
  let component: FiliereCoursComponent;
  let fixture: ComponentFixture<FiliereCoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiliereCoursComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiliereCoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
