import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService, SuiviCours } from './dashboardService/dashboard-service';
import { Filiere } from '../crud/filiere/filiere';
import { Enseignant } from '../crud/enseignant/enseignant';
import { Cours } from '../crud/cours/cours';
import { Salle } from '../crud/salle/salle';
import { FiliereService } from '../crud/filiere/filiere';
import { CoursService } from '../crud/cours/cours';
import { EnseignantService } from '../crud/enseignant/enseignant';
import { SalleService } from '../crud/salle/salle';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  progressionGlobale = 0;
  nbEnseignants = 0;
  nbFilieres = 0;
  nbCours = 0;
  nbSalles = 0;

  suivis: SuiviCours[] = [];
  filieres: Filiere[] = [];
  enseignants: Enseignant[] = [];
  cours: Cours[] = [];
  salles: Salle[] = [];

  constructor(
    private router: Router,
    private dashboardService: DashboardService,
    private filiereService: FiliereService,
    private enseignantService: EnseignantService,
    private coursService: CoursService,
    private salleService: SalleService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.dashboardService.getAll().subscribe(data => {
      this.suivis = data;
      this.computeProgression();
    });

    this.filiereService.getAll().subscribe(data => {
      this.filieres = data;
      this.nbFilieres = data.length;
    });

    this.enseignantService.getAll().subscribe(data => {
      this.enseignants = data;
      this.nbEnseignants = data.length;
    });

    this.coursService.getAllDistinct().subscribe(data => {
      this.cours = data;
      this.nbCours = data.length;
    });

    this.salleService.getAll().subscribe(data => {
      this.salles = data;
      this.nbSalles = data.length;
    });
  }

  computeProgression() {
    if (!this.suivis.length) return;
    const coursEffectues = this.suivis.filter(s => s.duree && +s.duree > 0).length;
    this.progressionGlobale = Math.round((coursEffectues / this.suivis.length) * 100);
  }

  goToProgressionDetails() { this.router.navigate(['/admin/progression']); }
  goToEnseignants() { this.router.navigate(['/admin/crud/enseignants']); }
  goToFilieres() { this.router.navigate(['/admin/crud/filieres']); }
  goToCours() { this.router.navigate(['/admin/crud/cours']); }
  goToSalles() { this.router.navigate(['/admin/crud/salles']); }

}
