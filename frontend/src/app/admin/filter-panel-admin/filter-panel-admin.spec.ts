import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterPanelAdmin } from './filter-panel-admin';

describe('FilterPanelAdmin', () => {
  let component: FilterPanelAdmin;
  let fixture: ComponentFixture<FilterPanelAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterPanelAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterPanelAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
