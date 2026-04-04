import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilieresGrid } from './filieres-grid';

describe('FilieresGrid', () => {
  let component: FilieresGrid;
  let fixture: ComponentFixture<FilieresGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilieresGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilieresGrid);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
