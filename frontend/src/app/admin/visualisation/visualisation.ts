import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Cours } from '../crud/cours/cours';
import { Salle } from '../crud/salle/salle';
import { Enseignant } from '../crud/enseignant/enseignant';
import { Creneau } from '../creneau-form/creneauService/creneau-service';
import { PlanningHebdomadaire } from '../planning-hebdomadaire/planningHebdomadaireService/planning-hebdomadaire-service';
import { Filiere } from '../crud/filiere/filiere';
import { FiliereService } from '../crud/filiere/filiere';
import { PlanningHebdomadaireService } from '../planning-hebdomadaire/planningHebdomadaireService/planning-hebdomadaire-service';
import { CreneauService } from '../creneau-form/creneauService/creneau-service';
import { CoursService } from '../crud/cours/cours';
import { EnseignantService } from '../crud/enseignant/enseignant';
import { SalleService } from '../crud/salle/salle';
import { CreneauForm } from '../creneau-form/creneau-form';

@Component({
  selector: 'app-visualisation',
  standalone: true,
  imports: [FormsModule, CommonModule, CreneauForm],
  templateUrl: './visualisation.html',
  styleUrl: './visualisation.css'
})

export class Visualisation implements OnInit {
  creneaux: Creneau[] = [];
  coursList: Cours[] = [];
  enseignantsList: Enseignant[] = [];
  sallesList: Salle[] = [];
  allPlannings: PlanningHebdomadaire[] = [];

  filieres: Filiere[] = [];
  jours: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  heures: string[] = ['08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00', '18:00 - 19:00', '19:00 - 20:00'];

  selectedFiliereId: number | null = null;
  selectedPlanningId: number | null = null;
  selectedCreneau: Creneau | null = null;
  isCreneauFormVisible = false;
  
  selectedFiliere!: string;
  selectedSemestre!: string;

  legendItems = [
    { class: 'bg-blue-200 border-blue-200', label: 'CM', shortLabel: 'CM' },
    { class: 'bg-amber-200 border-amber-200', label: 'TD', shortLabel: 'TD' },
    { class: 'bg-teal-200 border-teal-200', label: 'TP', shortLabel: 'TP' },
    { class: 'bg-purple-200 border-purple-200', label: 'Examen', shortLabel: 'Exam' },
    { class: 'bg-rose-200 border-rose-200', label: 'Devoir', shortLabel: 'Dev' },
    { class: 'bg-gray-100 border-gray-200', label: 'Pause déjeuner', shortLabel: 'Pause' }
  ];

  constructor(
    private filiereService: FiliereService,
    private planningHebdomadaireService: PlanningHebdomadaireService,
    private creneauService: CreneauService,
    private coursService: CoursService,
    private enseignantService: EnseignantService,
    private salleService: SalleService
  ) {}

  ngOnInit(): void {
    this.filiereService.getAll().subscribe({
      next: (data) => { this.filieres = data; },
      error: (err) => { console.error('Erreur filieres:', err); }
    });

    this.planningHebdomadaireService.getAll().subscribe({
      next: (data) => { this.allPlannings = data; },
      error: (err) => { console.error('Erreur plannings:', err); }
    });

    this.loadCreneaux();    

    this.coursService.getAll().subscribe({
      next: (data) => { this.coursList = data; },
      error: (err) => console.error('Erreur cours:', err)
    });

    this.enseignantService.getAll().subscribe({
      next: (data) => { this.enseignantsList = data; },
      error: (err) => console.error('Erreur enseignants:', err)
    });

    this.salleService.getAll().subscribe({
      next: (data) => { this.sallesList = data; },
      error: (err) => console.error('Erreur salles:', err)
    });
  }

  get planningsFiltres(): PlanningHebdomadaire[] {
    return this.allPlannings.filter(p => p.filiereId === this.selectedFiliereId);
  }

  trackByCreneau(index: number, creneau: Creneau): number {
    return creneau.id ?? index;
  }
  
  loadCoursByFiliere(filiereId: number): void {
    this.coursService.getByFiliere(filiereId).subscribe({
      next: (data) => {
        this.coursList = data;
        console.log('Cours chargés pour la filière', filiereId, ':', this.coursList);
      },
      error: (err) => console.error('Erreur lors du chargement des cours par filière:', err)
    });
  }

  loadEnseignantByFiliere(filiereId: number): void{
    this.enseignantService.getByFiliere(filiereId).subscribe({
      next: (data) => {
        this.enseignantsList = data;
      },
      error: (err) => console.error('Erreur lors du chargement des cours par filière:', err)
    })
  }
  
  // Méthodes pour la version mobile
getCoursForHour(jour: string, heure: string): any {
  if (heure === '13:00 - 14:00' || heure === '14:00 - 15:00') {
    return null;
  }

  const heureDebut = heure.split('-')[0].trim();
  const creneau = this.creneauxFiltres.find(c => {
    const creneauJour = this.jourCreneau(c);
    return creneauJour?.toLowerCase() === jour.toLowerCase() && 
           c.heureDebut.substring(0, 5) === heureDebut;
  });
  
  if (!creneau) return null;
  
  return {
    nom: this.getCoursNom(creneau.coursId),
    enseignant: this.getEnseignantNom(creneau.enseignantId),
    salle: this.getSalleNom(creneau.salleId),
    type: this.getTypeCours(creneau.coursId)
  };
}

jourCreneau(creneau: Creneau): string {
  if (!creneau?.date) return '';
  
  const dateObj = new Date(creneau.date);
  if (isNaN(dateObj.getTime())) {
    console.warn('Date invalide pour le créneau:', creneau.date);
    return '';
  }

  const jourIndex = dateObj.getDay();
  const joursFR = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  
  // getDay() retourne 0 pour Dimanche, 1 pour Lundi, etc.
  // On ajuste pour que Lundi = 0, Mardi = 1, etc.
  const adjustedIndex = jourIndex === 0 ? 6 : jourIndex - 1;
  
  return joursFR[adjustedIndex] || '';
}

getTypeForHour(jour: string, heure: string): string {
  if (heure === '13:00 - 14:00' || heure === '14:00 - 15:00') {
    return 'pause';
  }

  const heureDebut = heure.split('-')[0].trim();
  const creneau = this.creneauxFiltres.find(c => {
    const creneauJour = this.jourCreneau(c);
    return creneauJour?.toLowerCase() === jour.toLowerCase() && 
           c.heureDebut.substring(0, 5) === heureDebut;
  });
  
  return creneau ? this.getTypeCours(creneau.coursId) : '';
}

onMobileCellClicked(jour: string, heure: string): void {
  if (heure === '13:00 - 14:00' || heure === '14:00 - 15:00') {
    return; // Ne rien faire pour les pauses
  }

  const heureDebut = heure.split('-')[0].trim();
  const creneau = this.creneauxFiltres.find(c => {
    const creneauJour = this.jourCreneau(c);
    return creneauJour?.toLowerCase() === jour.toLowerCase() && 
           c.heureDebut.substring(0, 5) === heureDebut;
  });

  if (creneau) {
    this.onCreneauClicked({ creneau });
  } else {
    this.onEmptyCellClicked(heureDebut, jour);
  }
}
  shouldDisplayStart(creneau: Creneau, heure: string, jour: string): boolean {
    if (creneau.planningHebdomadaireId !== this.selectedPlanningId) return false;
  
    const dateObj = new Date(creneau.date);
    if (isNaN(dateObj.getTime())) {
      console.warn('Date invalide pour le créneau:', creneau.date);
      return false;
    }
  
    const jourIndex = dateObj.getDay();
    const joursFR = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const jourNom = joursFR[jourIndex-1];
  
    const heureDebut = creneau.heureDebut.substring(0, 5);
  
    const matchJour = jourNom.toLowerCase() === jour.toLowerCase();
    const matchHeure = heureDebut === heure;
  
    const match = matchJour && matchHeure;
  
    console.log(`[DEBUG] Creneau #${creneau.id} - Jour: ${jourNom}, Heure: ${heureDebut} → Match? ${match}`);
  
    return match;
  }
  
  onCreneauClicked(event: { creneau: Creneau }) {
    this.selectedCreneau = event.creneau;
    this.isCreneauFormVisible = true;
  }
  
  onCreneauUpdated(updatedCreneau: Creneau) {
    // Option 1 : recharge les créneaux depuis l'API
    this.loadCreneaux();
  
    // Option 2 : ou bien mets à jour localement
    const index = this.creneaux.findIndex(c => c.id === updatedCreneau.id);
    if (index !== -1) {
      this.creneaux[index] = updatedCreneau;
    }
  
    this.creneaux.filter(c => c.planningHebdomadaireId === this.selectedPlanningId);
    this.isCreneauFormVisible = false;
  }
  
  // getHeightForCreneau(creneau: Creneau): number {
  //   const [hDeb, mDeb] = creneau.heureDebut.split(':').map(Number);
  //   const [hFin, mFin] = creneau.heureFin.split(':').map(Number);
  //   const start = hDeb * 60 + mDeb;
  //   const end = hFin * 60 + mFin;
  //   const diffMinutes = end - start;
  //   return Math.max((diffMinutes / 60) * 80, 40);
  // }
  getHeightForCreneau(creneau: Creneau): number {
    const [hD, mD] = creneau.heureDebut.split(':').map(Number);
    const [hF, mF] = creneau.heureFin.split(':').map(Number);
    const debut = new Date(1970, 0, 1, hD, mD);
    const fin = new Date(1970, 0, 1, hF, mF);
    const diffHeures = (fin.getTime() - debut.getTime()) / (1000 * 60 * 60);
    const hauteurParHeure = 80;
    return diffHeures * hauteurParHeure;
  }

  onEmptyCellClicked(heure: string, jour: string) {
    if (!this.selectedPlanningId) return;
  
    const date = this.getDateFromJourAndPlanning(jour, this.selectedPlanningId);
    const heureFin = this.incrementHour(heure);
  
    this.selectedCreneau = {
      date,
      heureDebut: heure,
      heureFin: heureFin,
      coursId: 0,
      enseignantId: 0,
      salleId: 0,
      planningHebdomadaireId: this.selectedPlanningId
    };
  
    this.isCreneauFormVisible = true;
  }
  
  onFiliereChange(): void {
    if (this.selectedFiliereId) {
      this.loadCoursByFiliere(this.selectedFiliereId);
      this.loadEnseignantByFiliere(this.selectedFiliereId);
    } else {
      this.coursList = [];
    }
  }
  
  getDateFromJourAndPlanning(jour: string, planningId: number): string {
    const planning = this.allPlannings.find(p => p.id === planningId);
    if (!planning) return '';
  
    const jours = ['Dimanche','Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const indexJour = jours.indexOf(jour);
  
    if (indexJour === -1) return '';
  
    const dateDebut = new Date(planning.dateDebut);
    const planningDay = new Date(dateDebut);
    const offset = indexJour - dateDebut.getDay();
    planningDay.setDate(planningDay.getDate() + offset);
  
    return planningDay.toISOString().split('T')[0];
  }
  
  incrementHour(heure: string): string {
    const [h, m] = heure.split(':').map(Number);
    const fin = (h + 1) % 24;
    return `${fin.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  hasCreneauAt(heure: string, jour: string): boolean {
    return this.creneauxFiltres.some(creneau => this.shouldDisplayStart(creneau, heure, jour));
  }
  
  isPlanningActif(): boolean {
    const planning = this.allPlannings.find(p => p.id === this.selectedPlanningId);
    return planning?.statut === 'actif';
  }
  
  togglePlanningStatut(): void {
    const planning = this.allPlannings.find(p => p.id === this.selectedPlanningId);
    if (!planning || !planning.id) return;
  
    const newStatut = planning.statut === 'archive' ? 'actif' : 'archive';
    const updatedPlanning = { ...planning, statut: newStatut };
  
    this.planningHebdomadaireService.update(planning.id, updatedPlanning).subscribe({
      next: (updated) => {
        const index = this.allPlannings.findIndex(p => p.id === updated.id);
        if (index !== -1) this.allPlannings[index] = updated;
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du statut du planning :', err);
      }
    });
  }
  
  getCoursNom(id: number): string {
    return this.coursList.find(c => c.id === id)?.nomCours ?? 'Cours';
  }

  getEnseignantNom(id: number): string {
    const enseignant = this.enseignantsList.find(e => e.id === id);
    return enseignant ? `${enseignant.prenomEnseignant} ${enseignant.nomEnseignant}` : 'Enseignant';
  }

  getSalleNom(id: number): string {
    return this.sallesList.find(s => s.id === id)?.nomSalle ?? 'Salle';
  }

  getTypeCours(id: number): string {
    return this.coursList.find(c => c.id === id)?.typeDeCours || 'CM';
  }

  get creneauxFiltres(): Creneau[] {
    return this.creneaux.filter(c => c.planningHebdomadaireId === this.selectedPlanningId);
  }

  onCreneauDeleted(creneauId: number) {
    this.creneaux = this.creneaux.filter(c => c.id !== creneauId);
    this.isCreneauFormVisible = false;
  }
  
  loadCreneaux(): void {
    this.creneauService.getAll().subscribe({
      next: (data) => {
        this.creneaux = data;
        console.log('Créneaux chargés :', this.creneaux);
      },
      error: (err) => console.error('Erreur créneaux:', err)
    });
  }
  
}
