import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeTableView } from './time-table-view';

describe('TimeTableView', () => {
  let component: TimeTableView;
  let fixture: ComponentFixture<TimeTableView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeTableView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeTableView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
