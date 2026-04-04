import { Component, OnInit } from '@angular/core';
import { FiliereCours, FiliereCoursService } from '../filiere-cours';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FiliereCoursForm } from '../filiere-cours-form/filiere-cours-form';
import { Filiere } from '../../../models/filiere.model';
import { Cours } from '../../../models/cours.model';
import { FiliereService } from '../../filiere/filiere';
import { CoursService } from '../../cours/cours';

@Component({
  selector: 'app-filiere-cours-component',
  imports: [FormsModule, CommonModule, FiliereCoursForm],
  templateUrl: './filiere-cours-component.html',
  styleUrl: './filiere-cours-component.css'
})
export class FiliereCoursComponent implements OnInit {
  filiereCoursList: FiliereCours[] = [];
  filieres: Filiere[] = [];
  cours: Cours[] = [];
  formVisible = false;
  selectedFiliereCours: FiliereCours | null = null;

  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(
    private filiereCoursService: FiliereCoursService,
    private filiereService: FiliereService,
    private coursService: CoursService
  ) {}

  ngOnInit() {
    this.loadFiliereCours();
    this.loadFilieres();
    this.loadCours();
  }

  loadFiliereCours() {
    this.filiereCoursService.getAll().subscribe(
      data => {
        console.log('📦 Données associations reçues:', data);
        this.filiereCoursList = data;
        this.currentPage = 1;
      }
    );
  }

  loadFilieres() {
    this.filiereService.getAll().subscribe(
      data => this.filieres = data
    );
  }

  loadCours() {
    this.coursService.getAll().subscribe(
      data => this.cours = data
    );
  }

  openForm(fc?: FiliereCours) {
    this.selectedFiliereCours = fc ? { ...fc,
      volumeHoraireTotal: fc.volumeHoraireTotal || 0,
     } : null;
    this.formVisible = true;
  }

  deleteFiliereCours(id: number) {
    if (confirm("Confirmez-vous la suppression de cette association ?")) {
      this.filiereCoursService.delete(id).subscribe(() => {
        this.loadFiliereCours();
        const totalPages = this.getTotalPages();
        if (this.currentPage > totalPages && totalPages > 0) {
          this.currentPage = totalPages;
        }
      });
    }
  }

  onSave(fc: FiliereCours) {
    if (fc.id) {
      this.filiereCoursService.update(fc.id, fc)
        .subscribe(() => {
          this.loadFiliereCours();
          this.closeForm();
        });
    } else {
      this.filiereCoursService.create(fc)
        .subscribe(() => {
          this.loadFiliereCours();
          this.closeForm();
        });
    }
  }

  closeForm() {
    this.formVisible = false;
    this.selectedFiliereCours = null;
  }

  getFiliereName(id: number): string {
    return this.filieres.find(f => f.id === id)?.nomFiliere || 'N/A';
  }

  getCoursName(id: number): string {
    return this.cours.find(c => c.id === id)?.nomCours || 'N/A';
  }

  getTypeCours(id: number): string{
    return this.cours.find(c => c.id === id)?.typeDeCours || 'N/A';
  }

  getPaginatedAssociations(): FiliereCours[] {
    if (this.itemsPerPage === 0) {
      return this.filiereCoursList;
    }
    
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filiereCoursList.slice(startIndex, endIndex);
  }

  getTotalPages(): number {
    if (this.itemsPerPage === 0 || this.filiereCoursList.length === 0) {
      return 1;
    }
    return Math.ceil(this.filiereCoursList.length / this.itemsPerPage);
  }

  getStartIndex(): number {
    if (this.filiereCoursList.length === 0) {
      return 0;
    }
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  getEndIndex(): number {
    if (this.itemsPerPage === 0) {
      return this.filiereCoursList.length;
    }
    const endIndex = this.currentPage * this.itemsPerPage;
    return Math.min(endIndex, this.filiereCoursList.length);
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
}