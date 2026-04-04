import { Component, OnInit } from '@angular/core';
import { Salle, SalleService } from '../salle';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SalleForm } from '../salle-form/salle-form';

@Component({
  selector: 'app-salle-component',
  imports: [FormsModule, CommonModule, SalleForm],
  templateUrl: './salle-component.html',
  styleUrl: './salle-component.css'
})
export class SalleComponent implements OnInit {
  salles: Salle[] = [];
  formVisible = false;
  selectedSalle: Salle | null = null;

  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(private salleService: SalleService) {}

  ngOnInit() {
    this.loadSalles();
  }

  loadSalles() {
    this.salleService.getAll().subscribe(
      data => {
        console.log('📦 Données reçues:', data);
        this.salles = data;
        this.currentPage = 1;
      }
    );
  }

  openForm(salle?: Salle) {
    this.selectedSalle = salle ? { ...salle } : null;
    this.formVisible = true;
  }

  deleteSalle(id: number) {
    if (confirm("Confirmez-vous la suppression de cette salle ?")) {
      this.salleService.delete(id).subscribe(() => {
        this.loadSalles();
        const totalPages = this.getTotalPages();
        if (this.currentPage > totalPages && totalPages > 0) {
          this.currentPage = totalPages;
        }
      });
    }
  }

  onSave(salle: Salle) {
    if (salle.id) {
      this.salleService.update(salle.id, salle)
        .subscribe(() => {
          this.loadSalles();
          this.closeForm();
        });
    } else {
      this.salleService.create(salle)
        .subscribe(() => {
          this.loadSalles();
          this.closeForm();
        });
    }
  }

  closeForm() {
    this.formVisible = false;
    this.selectedSalle = null;
  }

  getPaginatedSalles(): Salle[] {
    if (this.itemsPerPage === 0) {
      return this.salles;
    }
    
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.salles.slice(startIndex, endIndex);
  }

  getTotalPages(): number {
    if (this.itemsPerPage === 0 || this.salles.length === 0) {
      return 1;
    }
    return Math.ceil(this.salles.length / this.itemsPerPage);
  }

  getStartIndex(): number {
    if (this.salles.length === 0) {
      return 0;
    }
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  getEndIndex(): number {
    if (this.itemsPerPage === 0) {
      return this.salles.length;
    }
    const endIndex = this.currentPage * this.itemsPerPage;
    return Math.min(endIndex, this.salles.length);
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