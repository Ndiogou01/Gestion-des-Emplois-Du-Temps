import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmploiTempsGestion } from './emploi-temps-gestion';

describe('EmploiTempsGestion', () => {
  let component: EmploiTempsGestion;
  let fixture: ComponentFixture<EmploiTempsGestion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmploiTempsGestion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmploiTempsGestion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
