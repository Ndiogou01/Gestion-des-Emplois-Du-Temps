import { Component, OnInit } from '@angular/core';
import { Enseignant, EnseignantService } from '../enseignant';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EnseignantForm } from '../enseignant-form/enseignant-form';

@Component({
  selector: 'app-enseignant-component',
  imports: [CommonModule, FormsModule, EnseignantForm],
  templateUrl: './enseignant-component.html',
  styleUrl: './enseignant-component.css'
})
export class EnseignantComponent implements OnInit {
  enseignants: Enseignant[] = [];
  formVisible = false;
  selectedEnseignant: Enseignant | null = null;
  
  // Propriétés pour la pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(private enseignantService: EnseignantService) {}

  ngOnInit() {
    this.loadEnseignants();
  }

  loadEnseignants() {
    this.enseignantService.getAll().subscribe(
      data => {
        console.log('📦 Données reçues:', data);
        this.enseignants = data;
        // Réinitialiser à la première page après chargement
        this.currentPage = 1;
      }
    );
  }

  openForm(enseignant?: Enseignant) {
    this.selectedEnseignant = enseignant ? { ...enseignant } : null;
    this.formVisible = true;
  }

  deleteEnseignant(id: number) {
    if (confirm("Confirmez-vous la suppression de cet enseignant ?")) {
      this.enseignantService.delete(id).subscribe(() => {
        this.loadEnseignants();
        // Ajuster la page courante si nécessaire après suppression
        const totalPages = this.getTotalPages();
        if (this.currentPage > totalPages && totalPages > 0) {
          this.currentPage = totalPages;
        }
      });
    }
  }

  onSave(enseignant: Enseignant) {
    if (enseignant.id) {
      this.enseignantService.update(enseignant.id, enseignant)
        .subscribe(() => {
          this.loadEnseignants();
          this.closeForm();
        });
    } else {
      this.enseignantService.create(enseignant)
        .subscribe(() => {
          this.loadEnseignants();
          this.closeForm();
        });
    }
  }

  closeForm() {
    this.formVisible = false;
    this.selectedEnseignant = null;
  }

  // Méthodes pour la pagination
  getPaginatedEnseignants(): Enseignant[] {
    if (this.itemsPerPage === 0) {
      return this.enseignants; // Afficher tout
    }
    
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.enseignants.slice(startIndex, endIndex);
  }

  getTotalPages(): number {
    if (this.itemsPerPage === 0 || this.enseignants.length === 0) {
      return 1;
    }
    return Math.ceil(this.enseignants.length / this.itemsPerPage);
  }

  getStartIndex(): number {
    if (this.enseignants.length === 0) {
      return 0;
    }
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  getEndIndex(): number {
    if (this.itemsPerPage === 0) {
      return this.enseignants.length;
    }
    const endIndex = this.currentPage * this.itemsPerPage;
    return Math.min(endIndex, this.enseignants.length);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
    }
  }

  getVisiblePages(): number[] {
    const totalPages = this.getTotalPages();
    const current = this.currentPage;
    const pages: number[] = [];
    
    // Logique pour afficher maximum 5 pages
    const maxVisible = 5;
    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    // Ajuster le début si on est proche de la fin
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  // Méthode pour changer le nombre d'éléments par page
  onItemsPerPageChange(event: any): void {
    const value = event.target.value;
    this.itemsPerPage = value === 'all' ? 0 : parseInt(value, 10);
    this.currentPage = 1; // Retourner à la première page
  }
}