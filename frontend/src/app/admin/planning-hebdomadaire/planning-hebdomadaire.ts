import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Filiere } from '../models/filiere.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FiliereService } from '../crud/filiere/filiere';

@Component({
  selector: 'app-planning-hebdomadaire',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './planning-hebdomadaire.html',
  styleUrl: './planning-hebdomadaire.css'
})

export class PlanningHebdomadaire implements OnInit {
  filieres: Filiere[] = [];
  semestres = ['S1', 'S2'];
  selectedFiliere: number | null = null;
  selectedSemestre: string | null = null;

  startDate: string = '';
  endDate: string = '';

  // Propriétés pour le modal
  showNewPlanningModal: boolean = false;
  modalSelectedFiliere: number | null = null;
  modalSelectedSemestre: string | null = null;
  newStartDate: string = '';
  newEndDate: string = '';

  @Output() planningChange = new EventEmitter<{
    filiereId: number;
    semestre: string;
    dateDebut: string;
    dateFin: string;
  }>();

  constructor(private filiereService: FiliereService) {}

  ngOnInit(): void {
    this.filiereService.getAll().subscribe({
      next: (data) => (this.filieres = data),
      error: (err) => console.error('Erreur lors du chargement des filières :', err)
    });
  }

  // Méthode pour obtenir le nom de la filière sélectionnée
  getSelectedFiliereName(): string {
    if (!this.selectedFiliere) return '';
    const filiere = this.filieres.find(f => f.id === this.selectedFiliere);
    return filiere ? filiere.nomFiliere : '';
  }

  get formattedDateRange(): string {
    return this.startDate && this.endDate
      ? `${this.formatDisplayDate(this.startDate)} au ${this.formatDisplayDate(this.endDate)}`
      : '(dates non définies)';
  }

  openNewPlanningModal(): void {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    // Pré-remplir avec les valeurs actuelles
    this.modalSelectedFiliere = this.selectedFiliere;
    this.modalSelectedSemestre = this.selectedSemestre;
    this.newStartDate = this.formatDateForInput(today);
    this.newEndDate = this.formatDateForInput(nextWeek);
    
    this.showNewPlanningModal = true;
  }

  closeNewPlanningModal(): void {
    this.showNewPlanningModal = false;
  }

  createNewPlanning(): void {
    if (!this.modalSelectedFiliere || !this.modalSelectedSemestre) {
      alert('Veuillez sélectionner une filière et un semestre.');
      return;
    }

    if (!this.newStartDate || !this.newEndDate) {
      alert('Veuillez sélectionner les dates de début et de fin.');
      return;
    }

    // Mettre à jour les sélections principales
    this.selectedFiliere = this.modalSelectedFiliere;
    this.selectedSemestre = this.modalSelectedSemestre;
    this.startDate = this.newStartDate;
    this.endDate = this.newEndDate;

    // Émettre l'événement
    this.planningChange.emit({
      filiereId: this.selectedFiliere,
      semestre: this.selectedSemestre,
      dateDebut: this.startDate,
      dateFin: this.endDate
    });

    this.closeNewPlanningModal();
  }

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private formatDisplayDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  loadPlanning() {
    if (this.selectedFiliere && this.selectedSemestre) {
      console.log('Chargement du planning pour', this.selectedFiliere, this.selectedSemestre);
      
      if (this.startDate && this.endDate) {
        this.planningChange.emit({
          filiereId: this.selectedFiliere,
          semestre: this.selectedSemestre,
          dateDebut: this.startDate,
          dateFin: this.endDate
        });
      }
    }
  }
}