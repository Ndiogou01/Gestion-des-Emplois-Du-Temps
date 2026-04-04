import { Component, OnInit } from '@angular/core';
import { FiliereService } from '../../../crud/filiere/filiere';
import { DashboardService } from '../../dashboardService/dashboard-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progression',
  imports: [FormsModule, CommonModule],
  templateUrl: './progression.html',
  styleUrl: './progression.css'
})
export class Progression {
  filieres: any[] = [];
  selectedFiliereId: number | null = null;
  coursProgression: any[] = [];

  constructor(private filiereService: FiliereService, private dashboardService: DashboardService) {}

  ngOnInit() {
    this.filiereService.getAll().subscribe(data => {
      console.log(data);
      this.filieres = data
    });
  }

  onFiliereChange() {
    if (!this.selectedFiliereId) return;
    this.dashboardService.getProgressionByFiliere(this.selectedFiliereId)
    .subscribe(data => {
      console.log("Data progression reçue :", data);
      this.coursProgression = data;
    });
  }

  getProgressPercent(cours: any): number {
    if (!cours || !cours.volumeHoraireTotal || cours.volumeHoraireTotal === 0) {
      return 0;
    }
    const effectue = cours.volumeHoraireEffectue ?? 0;
    return Math.round((effectue / cours.volumeHoraireTotal) * 100);
  }
  
}
