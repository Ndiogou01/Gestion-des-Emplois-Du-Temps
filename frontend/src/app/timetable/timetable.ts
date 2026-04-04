import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TimeTableView } from '../time-table-view/time-table-view';
import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';


@Component({
  selector: 'app-timetable',
  imports: [CommonModule, TimeTableView, Navbar, Footer],
  templateUrl: './timetable.html',
  styleUrl: './timetable.css'
})
export class Timetable implements OnInit {
  filiereId!: number;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.filiereId = +this.route.snapshot.paramMap.get('id')!;
  }
}
