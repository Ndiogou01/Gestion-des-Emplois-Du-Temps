import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Creneau } from '../creneau-form/creneauService/creneau-service';
import { Cours } from '../crud/cours/cours';
import { Salle } from '../crud/salle/salle';
import { Enseignant } from '../crud/enseignant/enseignant';

@Component({
  selector: 'app-planning-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './planning-grid.html',
  styleUrls: ['./planning-grid.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PlanningGrid {
  @Input() creneaux: Creneau[] = [];
  @Input() coursList: Cours[] = [];
  @Input() enseignants: Enseignant[] = [];
  @Input() salles: Salle[] = [];
  @Output() caseClick = new EventEmitter<{ jour: string; heure: string }>();
  @Output() creneauClick = new EventEmitter<{ creneau: Creneau }>();

  heures = ['08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00','18:00 - 19:00', '19:00 - 20:00']; 
  jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  showConflictModal = false;

  legendItems = [
    { class: 'bg-blue-200 border-blue-200', label: 'CM', shortLabel: 'CM' },
    { class: 'bg-amber-200 border-amber-200', label: 'TD', shortLabel: 'TD' },
    { class: 'bg-teal-200 border-teal-200', label: 'TP', shortLabel: 'TP' },
    { class: 'bg-purple-200 border-purple-200', label: 'Examen', shortLabel: 'Exam' },
    { class: 'bg-rose-200 border-rose-200', label: 'Devoir', shortLabel: 'Dev' },
    { class: 'bg-gray-100 border-gray-200', label: 'Pause déjeuner', shortLabel: 'Pause' }
  ];

  trackByCreneau(index: number, creneau: Creneau): number {
    return creneau.id || index;
  }

  shouldDisplayStart(creneau: Creneau, heure: string, jour: string): boolean {
    return this.formatJour(creneau.date) === jour &&
           this.formatHeure(creneau.heureDebut) === heure;
  }

  formatJour(dateStr: string): string {
    const date = new Date(dateStr);
    const dayIndex = (date.getDay() + 6) % 7;
    return this.jours[dayIndex] || '';
  }

  onConflict() {
    this.showConflictModal = true;
  }
  
  formatHeure(heure: string): string {
    return heure?.substring(0, 5);
  }

  getHeightForCreneau(creneau: Creneau): number {
    const [hD, mD] = creneau.heureDebut.split(':').map(Number);
    const [hF, mF] = creneau.heureFin.split(':').map(Number);
    const debut = new Date(1970, 0, 1, hD, mD);
    const fin = new Date(1970, 0, 1, hF, mF);
    const diffHeures = (fin.getTime() - debut.getTime()) / (1000 * 60 * 60);
    const hauteurParHeure = 80;
    return diffHeures * hauteurParHeure;
  }

  getCoursNom(id: number): string {
    return this.coursList.find(c => c.id === id)?.nomCours || 'Cours inconnu';
  }

  getEnseignantNom(id: number): string {
    const enseignant = this.enseignants.find(e => e.id === id);
    return enseignant ? `${enseignant.prenomEnseignant} ${enseignant.nomEnseignant}` : 'Enseignant';
  }

  getSalleNom(id: number): string {
    return this.salles.find(s => s.id === id)?.nomSalle || 'Salle inconnue';
  }
  
  getTypeCours(id: number): string {
    return this.coursList.find(c => c.id === id)?.typeDeCours || 'CM';
  }

  getCoursForHour(jour: string, heure: string): any {
    if (heure === '13:00 - 14:00' || heure === '14:00 - 15:00') {
      return null;
    }

    const heureDebut = heure.split('-')[0].trim();
    const creneau = this.creneaux.find(c => 
      this.shouldDisplayStart(c, heureDebut, jour)
    );
    
    if (!creneau) return null;
    
    return {
      nom: this.getCoursNom(creneau.coursId),
      enseignant: this.getEnseignantNom(creneau.enseignantId),
      salle: this.getSalleNom(creneau.salleId),
      type: this.getTypeCours(creneau.coursId)
    };
  }

  getTypeForHour(jour: string, heure: string): string {
    if (heure === '13:00 - 14:00' || heure === '14:00 - 15:00') {
      return 'pause';
    }

    const heureDebut = heure.split('-')[0].trim();
    const creneau = this.creneaux.find(c => 
      this.shouldDisplayStart(c, heureDebut, jour)
    );
    
    return creneau ? this.getTypeCours(creneau.coursId) : '';
  }

  onMobileCellClick(jour: string, heure: string): void {
    if (heure === '13:00 - 14:00' || heure === '14:00 - 15:00') {
      return; // Ne rien faire pour les pauses
    }

    const heureDebut = heure.split('-')[0].trim();
    const creneau = this.creneaux.find(c => 
      this.shouldDisplayStart(c, heureDebut, jour)
    );

    if (creneau) {
      this.creneauClick.emit({ creneau });
    } else {
      this.caseClick.emit({ jour, heure: heureDebut });
    }
  }

  hasCreneauAt(heure: string, jour: string): boolean {
    return this.creneaux.some(creneau => 
      this.shouldDisplayStart(creneau, heure, jour)
    );
  }
}
