import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlanningGrid } from '../planning-grid/planning-grid';
import { Creneau } from '../creneau-form/creneauService/creneau-service';
import { CreneauForm } from '../creneau-form/creneau-form';
import { FilterPanelAdmin } from '../filter-panel-admin/filter-panel-admin';
import { PlanningHebdomadaire } from '../planning-hebdomadaire/planning-hebdomadaire';
import { PlanningHebdomadaireService } from '../planning-hebdomadaire/planningHebdomadaireService/planning-hebdomadaire-service';
import { EnseignantService } from '../crud/enseignant/enseignant';
import { CoursService } from '../crud/cours/cours';
import { SalleService } from '../crud/salle/salle';
import { Cours } from '../crud/cours/cours';
import { Salle } from '../crud/salle/salle';
import { Enseignant } from '../crud/enseignant/enseignant';
import { CreneauService } from '../creneau-form/creneauService/creneau-service';
import { CreneauEtendu } from '../filter-panel-admin/filter-panel-admin';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-emploi-temps-gestion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PlanningGrid,
    CreneauForm,
    FilterPanelAdmin,
    PlanningHebdomadaire
  ],
  templateUrl: './emploi-temps-gestion.html',
  styleUrls: ['./emploi-temps-gestion.css']
})
export class EmploiTempsGestion implements OnInit {
  formVisible = false;
  conflictMessage: string | null = null;
  creneaux: Creneau[] = [];
  filteredCreneaux: Creneau[] = [];
  coursList: Cours[] = [];
  enseignants: Enseignant[] = [];
  salles: Salle[] = [];
  selectedCreneau: Creneau | null = null;
  planningHebdoId: number = 0;
  selectedFiliere: number | string = '';
  selectedSemestre: string = '';
  dateDebut!: string;
  dateFin!: string;
  creneauToDeleteId: number | null = null;
  showDeleteConfirmModal: boolean = false;
  filteredCreneauxE: CreneauEtendu[] = [];
  filter = { matiere: '', enseignant: '', salle: '' };
  heuresDisponibles: string[] = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  joursDisponibles: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  constructor(
    private planningHebdoService: PlanningHebdomadaireService,
    private coursService: CoursService,
    private enseignantService: EnseignantService,
    private salleService: SalleService,
    private creneauService: CreneauService
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    //this.coursService.getAll().subscribe(data => this.coursList = data);
    //this.enseignantService.getAll().subscribe(data => this.enseignants = data);
    this.salleService.getAll().subscribe(data => this.salles = data);
    this.loadCreneaux();
  }

  onCreneauxFiltres(creneaux: CreneauEtendu[]) {
    this.filteredCreneauxE = creneaux;
  }

  private loadCreneaux(): void {
    this.creneauService.getAll().subscribe({
      next: (data) => {
        this.creneaux = this.normalizeCreneaux(data);
        this.applyFilter();
      },
      error: (err) => console.error('Erreur chargement créneaux:', err)
    });
  }

  onDelete(id: number): void {
    this.creneauToDeleteId = id;
    this.showDeleteConfirmModal = true;
  }
 
  confirmDelete(): void {
    if (!this.creneauToDeleteId) return;
  
    this.creneauService.delete(this.creneauToDeleteId).subscribe({
      next: () => {
        this.creneaux = this.creneaux.filter(c => c.id !== this.creneauToDeleteId);
        this.applyFilter();
        this.closeForm();
        this.closeDeleteModal();
      },
      error: (err) => {
        console.error('Erreur lors de la suppression:', err);
      }
    });
  }  
  
  closeDeleteModal(): void {
    this.showDeleteConfirmModal = false;
    this.creneauToDeleteId = null;
  }
  
  onFilterChange(filter: { matiere: string; enseignant: string; salle: string }) {
    this.filter = filter;
    this.applyFilter();
  }

  private normalizeCreneaux(creneaux: Creneau[]): Creneau[] {
    return creneaux.map(c => ({
      ...c,
      heureDebut: c.heureDebut.slice(0, 5),
      heureFin: c.heureFin.slice(0, 5)
    }));
  }

  onPlanningChange(event: { filiereId: number; semestre: string; dateDebut: string; dateFin: string }): void {
    this.selectedFiliere = event.filiereId;
    this.selectedSemestre = event.semestre;
    this.dateDebut = event.dateDebut;
    this.dateFin = event.dateFin;

    const semaineAnnee = this.getSemaineAnnee(new Date(this.dateDebut));

    this.planningHebdoService.create({
      filiereId: this.selectedFiliere,
      semestre: this.selectedSemestre,
      dateDebut: new Date(this.dateDebut),
      dateFin: new Date(this.dateFin),
      statut: 'actif',
      semaineAnnee,
      dateCreation: new Date()
    }).subscribe({
      next: (res) => {
        this.planningHebdoId = res.id ?? 0;
    
        // lancer les deux requêtes en parallèle
        forkJoin({
          cours: this.coursService.getByFiliere(this.selectedFiliere as number),
          enseignants: this.enseignantService.getByFiliere(this.selectedFiliere as number)
        }).subscribe({
          next: ({ cours, enseignants }) => {
            this.coursList = cours;
        
            // On enrichit les enseignants avec le cours associé
            this.enseignants = enseignants.map(e => {
              const coursAssocie = this.coursList.find(c => c.enseignantResponsableId === e.id);
              return {
                ...e,
                coursNom: coursAssocie
                  ? `${coursAssocie.nomCours} (${coursAssocie.typeDeCours})`
                  : 'Aucun cours'
              };
            });
            this.loadPlanning();
          },
          error: (err) => console.error('Erreur chargement cours/enseignants par filière:', err)
        });
      },
      error: (err) => console.error('Erreur création planning:', err)
    });
  }

  loadPlanning(): void {
    if (!this.planningHebdoId) return;

    this.creneaux = [];
    
    this.creneauService.getByPlanningHebdomadaire(this.planningHebdoId).subscribe({
      next: (data) => {
        this.creneaux = this.normalizeCreneaux(data);
        this.applyFilter();
      },
      error: (err) => console.error('Erreur chargement planning:', err)
    });
  }

  applyFilter(): void {
    this.filteredCreneaux = this.creneaux.filter(c =>
      (!this.filter.matiere || this.getCoursNom(c.coursId).toLowerCase().includes(this.filter.matiere.toLowerCase())) &&
      (!this.filter.enseignant || this.getEnseignantNom(c.enseignantId).toLowerCase().includes(this.filter.enseignant.toLowerCase())) &&
      (!this.filter.salle || this.getSalleNom(c.salleId).toLowerCase().includes(this.filter.salle.toLowerCase()))
    );
  }
  

  openCreneauForm(creneau: Creneau | null, jour?: string, heure?: string): void {
    const selectedDate = this.calculateDateFromDay(jour);
    
    this.selectedCreneau = creneau ? { ...creneau } : {
      id: 0,
      date: selectedDate,
      heureDebut: heure || '',
      heureFin: '',
      coursId: 0,
      enseignantId: 0,
      salleId: 0,
      planningHebdomadaireId: this.planningHebdoId
    };
    
    this.formVisible = true;
    this.conflictMessage = null;
  }

  private calculateDateFromDay(jour?: string): string {
    if (!jour) return this.dateDebut;
  
    const jourIndex = this.joursDisponibles.indexOf(jour);
    if (jourIndex < 0) return this.dateDebut;
  
    const baseDate = new Date(this.dateDebut);
    const baseDay = baseDate.getDay(); 
    const baseOffset = baseDay === 0 ? -6 : 1 - baseDay;
  
    baseDate.setDate(baseDate.getDate() + baseOffset + jourIndex);
  
    return baseDate.toLocaleDateString('fr-CA');
  }

  onSave(creneau: Creneau): void {
    const operation = creneau.id 
      ? this.creneauService.update(creneau.id, creneau)
      : this.creneauService.create(creneau);

    operation.subscribe({
      next: (savedCreneau) => {
        this.handleSaveSuccess(savedCreneau);
      },
      error: (err) => {
        console.error('Erreur sauvegarde:', err);
        this.handleConflict();
      }
    });
  }

  private formatTime(raw: string): string {
    if (!raw) return '';
    return raw.split(':').slice(0, 2).join(':');
  }
  
  private handleSaveSuccess(savedCreneau: Creneau): void {
    savedCreneau = {
      ...savedCreneau,
      heureDebut: this.formatTime(savedCreneau.heureDebut),
      heureFin: this.formatTime(savedCreneau.heureFin)
    };
  
    const existingIndex = this.creneaux.findIndex(c => c.id === savedCreneau.id);
  
    if (existingIndex > -1) {
      this.creneaux = [
        ...this.creneaux.slice(0, existingIndex),
        savedCreneau,
        ...this.creneaux.slice(existingIndex + 1)
      ];
    } else {
      this.creneaux = [...this.creneaux, savedCreneau];
    }
  
    this.applyFilter();
    this.closeForm();
  }
  

  handleConflict(): void {
    if (!this.selectedCreneau) return;
    this.conflictMessage = `Conflit détecté pour ${this.getCoursNom(this.selectedCreneau.coursId)}`;
  }

  closeForm(): void {
    this.formVisible = false;
    this.selectedCreneau = null;
  }

  closeAlert(): void {
    this.conflictMessage = null;
  }

  get formattedDateRange(): string {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const start = new Date(this.dateDebut).toLocaleDateString('fr-FR', options);
    const end = new Date(this.dateFin).toLocaleDateString('fr-FR', options);
    return `du ${start} au ${end}`;
  }

  getCoursNom(id: number): string {
    return this.coursList.find(c => c.id === id)?.nomCours || 'Cours inconnu';
  }

  getSalleNom(id: number): string {
    return this.salles.find(s => s.id === id)?.nomSalle || 'Salle inconnue';
  }

  getEnseignantNom(id: number): string {
    const enseignant = this.enseignants.find(e => e.id === id);
    return enseignant ? `${enseignant.prenomEnseignant} ${enseignant.nomEnseignant}` : 'Enseignant';
  }

  isFiliereSelected(): boolean {
    return !!this.selectedFiliere && this.selectedFiliere !== '';
  }

  private getSemaineAnnee(date: Date): string {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return `S${weekNo}-${d.getUTCFullYear()}`;
  }

  logout() { console.log('Déconnexion'); }
}