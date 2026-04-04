import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FiliereService, Filiere } from '../admin/crud/filiere/filiere';

@Component({
  selector: 'app-filieres-grid',
  imports: [CommonModule, FormsModule],
  templateUrl: './filieres-grid.html',
  styleUrl: './filieres-grid.css'
})
export class FilieresGrid implements OnInit {
  searchText = '';
  filieres: Filiere[] = [];
  @Output() filiereSelected = new EventEmitter<number>();

  constructor(
    private filiereService: FiliereService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.filiereService.getAll().subscribe({
      next: (data) => this.filieres = data,
      error: (err) => console.error('Erreur chargement filières', err)
    });
  }

  filieresFiltered(): Filiere[] {
    const filter = this.searchText.toLowerCase();
    return this.filieres.filter(f =>
      f.nomFiliere.toLowerCase().includes(filter)
    );
  }

  onConsulter(filiere: Filiere) {
    this.filiereSelected.emit(filiere.id);
    this.router.navigate(['/edt', filiere.id]);
  }
}
