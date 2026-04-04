import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Visualisation } from './visualisation';

describe('Visualisation', () => {
  let component: Visualisation;
  let fixture: ComponentFixture<Visualisation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Visualisation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Visualisation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
