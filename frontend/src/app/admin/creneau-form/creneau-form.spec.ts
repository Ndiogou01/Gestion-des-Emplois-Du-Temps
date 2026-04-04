import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreneauForm } from './creneau-form';

describe('CreneauForm', () => {
  let component: CreneauForm;
  let fixture: ComponentFixture<CreneauForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreneauForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreneauForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
