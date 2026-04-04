import { Component, OnInit } from '@angular/core';
import { Cours, CoursService } from '../cours';
import { FormsModule } from '@angular/forms';
import { EnseignantService } from '../../enseignant/enseignant';
import { Enseignant } from '../../../models/enseignant.model';
import { CommonModule } from '@angular/common';
import { CoursForm } from '../cours-form/cours-form';

@Component({
  selector: 'app-cours-component',
  imports: [FormsModule, CommonModule, CoursForm],
  templateUrl: './cours-component.html',
  styleUrl: './cours-component.css'
})

export class CoursComponent implements OnInit {
  coursList: Cours[] = [];
  enseignants: Enseignant[] = [];
  formVisible = false;
  selectedCours: Cours | null = null;
  
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(
    private coursService: CoursService,
    private enseignantService: EnseignantService
  ) {}

  ngOnInit() {
    this.loadCours();
    this.loadEnseignants();
  }

  loadEnseignants() {
    this.enseignantService.getAll().subscribe(data => {
      this.enseignants = data;
    });
  }

  loadCours() {
    this.coursService.getAll().subscribe(data => {
      this.coursList = data;
      this.currentPage = 1;
    });
  }

  openForm() {
    this.selectedCours = null;
    this.formVisible = true;
  }

  editCours(cours: Cours) {
    this.selectedCours = { ...cours };
    this.formVisible = true;
  }

  deleteCours(id: number) {
    if (confirm("Confirmez-vous la suppression de ce cours ?")) {
      this.coursService.delete(id).subscribe(() => {
        this.loadCours();
        const totalPages = this.getTotalPages();
        if (this.currentPage > totalPages && totalPages > 0) {
          this.currentPage = totalPages;
        }
      });
    }
  }

  onSave(cours: Cours) {
    cours.enseignantResponsableId = Number(cours.enseignantResponsableId);

    console.log('Cours envoyé au backend:', cours);
    console.log('ID Enseignant responsable:', cours.enseignantResponsableId);
  
    if (cours.id) {
      this.coursService.update(cours.id, cours)
        .subscribe(() => {
          this.loadCours();
          this.closeForm();
        });
    } else {  
      this.coursService.create(cours)
        .subscribe(() => {
          this.loadCours();
          this.closeForm();
        });
    }
  }
  

  closeForm() {
    this.formVisible = false;
    this.selectedCours = null;
  }

  getPaginatedCours(): Cours[] {
    if (this.itemsPerPage === 0) {
      return this.coursList;
    }
    
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.coursList.slice(startIndex, endIndex);
  }

  getTotalPages(): number {
    if (this.itemsPerPage === 0 || this.coursList.length === 0) {
      return 1;
    }
    return Math.ceil(this.coursList.length / this.itemsPerPage);
  }

  getStartIndex(): number {
    if (this.coursList.length === 0) {
      return 0;
    }
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  getEndIndex(): number {
    if (this.itemsPerPage === 0) {
      return this.coursList.length;
    }
    const endIndex = this.currentPage * this.itemsPerPage;
    return Math.min(endIndex, this.coursList.length);
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
    
    const maxVisible = 5;
    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  onItemsPerPageChange(event: any): void {
    const value = event.target.value;
    this.itemsPerPage = value === 'all' ? 0 : parseInt(value, 10);
    this.currentPage = 1; 
  }

  getTypeClass(type: string): string {
    switch (type) {
      case 'CM': return 'bg-blue-100 text-blue-800';
      case 'TD': return 'bg-amber-100 text-amber-800';
      case 'TP': return 'bg-teal-100 text-teal-800';
      case 'Devoir': return 'bg-rose-100 text-rose-800';
      case 'Examen': return 'bg-purple-100 text-purple-800'; 
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getEnseignantName(enseignantId: number): string {
    if (!enseignantId || !this.enseignants) {
      return 'Non assigné';
    }
    
    const enseignant = this.enseignants.find(e => e.id === enseignantId);
    return enseignant ? `${enseignant.prenomEnseignant} ${enseignant.nomEnseignant}` : 'Non assigné';
  }
}