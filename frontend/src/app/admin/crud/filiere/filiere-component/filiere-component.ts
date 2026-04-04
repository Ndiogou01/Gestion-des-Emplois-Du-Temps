import { Component , OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FiliereService, Filiere } from '../filiere';
import { FiliereForm } from '../filiere-form/filiere-form';

@Component({
  selector: 'app-filiere-component',
  imports: [CommonModule, FormsModule, FiliereForm],
  templateUrl: './filiere-component.html',
  styleUrl: './filiere-component.css'
})
export class FiliereComponent implements OnInit{

  filieres: Filiere[] = [];
  formVisible = false;
  selectedFiliere: Filiere | null = null;

  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(private filiereService: FiliereService) {}

  ngOnInit() {
    this.loadFilieres();
  }

  loadFilieres() {
    this.filiereService.getAll().subscribe(
      data => {
        console.log('📦 Données reçues:', data);
        this.filieres = data;
        this.currentPage = 1;
      }
    );
  }

  openForm(filiere?: Filiere) {
    this.selectedFiliere = filiere ? { ...filiere } : null;
    this.formVisible = true;
  }

  deleteFiliere(id: number) {
    if (confirm("Confirmez-vous la suppression de cette filiere ?")) {
      this.filiereService.delete(id).subscribe(() => {
        this.loadFilieres();
        const totalPages = this.getTotalPages();
        if (this.currentPage > totalPages && totalPages > 0) {
          this.currentPage = totalPages;
        }
      });
    }
  }

  onSave(filiere: Filiere) {
    if (filiere.id) {
      this.filiereService.update(filiere.id, filiere)
        .subscribe(() => {
          this.loadFilieres();
          this.closeForm();
        });
    } else {
      this.filiereService.create(filiere)
        .subscribe(() => {
          this.loadFilieres();
          this.closeForm();
        });
    }
  }

  closeForm() {
    this.formVisible = false;
    this.selectedFiliere = null;
  }

  getPaginatedFilieres(): Filiere[] {
    if (this.itemsPerPage === 0) {
      return this.filieres;
    }
    
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filieres.slice(startIndex, endIndex);
  }

  getTotalPages(): number {
    if (this.itemsPerPage === 0 || this.filieres.length === 0) {
      return 1;
    }
    return Math.ceil(this.filieres.length / this.itemsPerPage);
  }

  getStartIndex(): number {
    if (this.filieres.length === 0) {
      return 0;
    }
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  getEndIndex(): number {
    if (this.itemsPerPage === 0) {
      return this.filieres.length;
    }
    const endIndex = this.currentPage * this.itemsPerPage;
    return Math.min(endIndex, this.filieres.length);
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
