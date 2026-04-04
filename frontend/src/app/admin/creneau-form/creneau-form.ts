import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Cours } from '../crud/cours/cours';
import { Salle } from '../crud/salle/salle';
import { Enseignant } from '../crud/enseignant/enseignant';
import { CreneauService, Creneau } from './creneauService/creneau-service';

@Component({
  selector: 'app-creneau-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './creneau-form.html',
  styleUrl: './creneau-form.css'
})

export class CreneauForm {
  @Input() creneau: Creneau = this.createEmptyCreneau();
  @Input() filiere!: string;
  @Input() semestre!: string;
  @Input() planningHebdomadaireId!: number;
  @Input() coursList: Cours[] = [];
  @Input() enseignants: Enseignant[] = [];
  @Input() salles: Salle[] = [];

  @Output() saveEvent = new EventEmitter<Creneau>();
  @Output() delete = new EventEmitter<number>();
  @Output() cancel = new EventEmitter<void>();
  @Output() conflict = new EventEmitter<void>();

  conflictMessage: string | null = null;

  constructor(private creneauService: CreneauService) {
    console.log('[CreneauForm] Composant initialisé');
  }

  onSave(): void {
    console.log('[onSave] Tentative de sauvegarde', this.creneau);

    if (this.creneau.heureDebut >= this.creneau.heureFin) {
      alert("L'heure de fin doit être après l'heure de début !");
      return;
    }
    if (!this.creneau.heureDebut || !this.creneau.heureFin) {
      console.error('[onSave] Heure de début ou fin manquante');
      return;
    }
    
    const newCreneau: Partial<Creneau> = {
      date: this.creneau.date,
      heureDebut: this.creneau.heureDebut,
      heureFin: this.creneau.heureFin,
      coursId: Number(this.creneau.coursId),
      enseignantId: Number(this.creneau.enseignantId),
      salleId: Number(this.creneau.salleId),
      planningHebdomadaireId: this.planningHebdomadaireId,
    };
    
    if (this.creneau.id) {
      newCreneau.id = this.creneau.id;
    }
    
    console.log('[onSave] Creneau préparé à envoyer', newCreneau);
  
    if (this.creneau.id) {
      console.log('[onSave] Mode édition (update)');
      this.creneauService.update(this.creneau.id, newCreneau).subscribe({
        next: (updated) => {
          console.log('[onSave] Creneau mis à jour avec succès', updated);
          this.saveEvent.emit(updated);
        },
        error: (err) => {
          if (err.status === 409) {
            this.conflictMessage = err.error?.message || "Conflit détecté.";
          } else {
            this.conflictMessage = "Une erreur est survenue lors de l'enregistrement.";
          }
          console.error('[onSave] Erreur création créneau :', err);
          this.conflict.emit();
        }
        
      });
    } else {
      console.log('[onSave] Mode création (create)');
      this.creneauService.create(newCreneau).subscribe({
        next: (created) => {
          console.log('[onSave] Creneau créé avec succès', created);
          this.saveEvent.emit(created);
        },
        error: (err) => {
          if (err.status === 409) {
            this.conflictMessage = err.error?.message || "Conflit détecté.";
          } else {
            this.conflictMessage = "Une erreur est survenue lors de la création.";
          }
          console.error('[onSave] Erreur création creneau :', err);
          this.conflict.emit();
        }        
      });
    }
  }
  

  deleteCreneau(): void {
    console.log('[deleteCreneau] Suppression demandée pour ID :', this.creneau.id);
    if (!this.creneau.id) return;

    this.creneauService.delete(this.creneau.id).subscribe({
      next: () => {
        console.log('[deleteCreneau] Creneau supprimé avec succès');
        this.delete.emit(this.creneau.id);
      },
      error: (err) => {
        console.error('[deleteCreneau] Erreur suppression :', err);
      }
    });
  }

  private createEmptyCreneau(): Creneau {
    const empty = {
      date: '',
      heureDebut: '',
      heureFin: '',
      coursId: 0,
      enseignantId: 0,
      salleId: 0,
      planningHebdomadaireId: 0
    };
    console.log('[createEmptyCreneau] Créneau vide créé', empty);
    return empty;
  }

  getEnseignantNom(id: number): string {
    const enseignant = this.enseignants.find(e => e.id === id);
    return enseignant ? `${enseignant.prenomEnseignant} ${enseignant.nomEnseignant}` : 'Enseignant';
  }
}
