import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Creneau, CreneauService } from '../creneau-form/creneauService/creneau-service';
import { Cours, CoursService } from '../crud/cours/cours';
import { Enseignant, EnseignantService } from '../crud/enseignant/enseignant';
import { Salle, SalleService } from '../crud/salle/salle';

export interface CreneauEtendu extends Creneau {
  cours?: Cours;
  enseignant?: Enseignant;
  salle?: Salle;
}

@Component({
  selector: 'app-filter-panel-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-panel-admin.html',
  styleUrl: './filter-panel-admin.css'
})
export class FilterPanelAdmin implements OnInit, OnChanges {
  matiere: string = '';
  enseignant: string = '';
  salle: string = '';
  coursList: Cours[] = [];
  enseignantsList: Enseignant[] = [];
  sallesList: Salle[] = [];
  @Output() filterChange = new EventEmitter<{ matiere: string; enseignant: string; salle: string }>();

  emitFilter() {
    this.filterChange.emit({
      matiere: this.matiere,
      enseignant: this.enseignant,
      salle: this.salle
    });
  }
  
  allCreneaux: CreneauEtendu[] = [];
  filteredCreneaux: CreneauEtendu[] = [];

  @Input() planningHebdomadaireId!: number;
  @Output() creneauxFiltres = new EventEmitter<CreneauEtendu[]>();

  constructor(
    private creneauService: CreneauService,
    private coursService: CoursService,
    private enseignantService: EnseignantService,
    private salleService: SalleService
  ) {}

  ngOnInit() {
    if (this.planningHebdomadaireId) {
      this.loadData(this.planningHebdomadaireId);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['planningHebdomadaireId'] && !changes['planningHebdomadaireId'].isFirstChange()) {
      this.loadData(changes['planningHebdomadaireId'].currentValue);
    }
  }

  loadData(planningId: number) {
    Promise.all([
      firstValueFrom(this.coursService.getAll()),
      firstValueFrom(this.enseignantService.getAll()),
      firstValueFrom(this.salleService.getAll()),
      firstValueFrom(this.creneauService.getByPlanningHebdomadaire(planningId))
    ]).then(([cours, enseignants, salles, creneaux]) => {
      if (!cours || !enseignants || !salles || !creneaux) return;
      this.coursList = cours;
      this.enseignantsList = enseignants;
      this.sallesList = salles;

      this.allCreneaux = creneaux.map(c => ({
        ...c,
        cours: this.coursList.find(co => co.id === c.coursId) ?? undefined,
        enseignant: this.enseignantsList.find(e => e.id === c.enseignantId) ?? undefined,
        salle: this.sallesList.find(s => s.id === c.salleId) ?? undefined,
      }));      

      this.filteredCreneaux = [...this.allCreneaux];
      this.creneauxFiltres.emit(this.filteredCreneaux);
    }).catch(error => {
      console.error('Erreur lors du chargement des données:', error);
    });
  }

  resetFilters() {
    this.matiere = '';
    this.enseignant = '';
    this.salle = '';
    this.filteredCreneaux = [...this.allCreneaux];
    this.creneauxFiltres.emit(this.filteredCreneaux);
  }
  
  

  emitFilterValues() {
    this.filterChange.emit({
      matiere: this.matiere,
      enseignant: this.enseignant,
      salle: this.salle
    });
  }

  applyFilter() {
    const matiereLower = this.matiere.toLowerCase();
    const enseignantLower = this.enseignant.toLowerCase();
    const salleLower = this.salle.toLowerCase();

    this.filteredCreneaux = this.allCreneaux.filter(c => {
      const matchMatiere = !this.matiere || c.cours?.nomCours?.toLowerCase().includes(matiereLower);
      const matchEnseignant = !this.enseignant || c.enseignant?.nomEnseignant?.toLowerCase().includes(enseignantLower);
      const matchSalle = !this.salle || c.salle?.nomSalle?.toLowerCase().includes(salleLower);
      return matchMatiere && matchEnseignant && matchSalle;
    });

    this.creneauxFiltres.emit(this.filteredCreneaux);
  }

}
