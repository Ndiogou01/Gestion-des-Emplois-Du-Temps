import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Enseignant } from '../enseignant';

@Component({
  selector: 'app-enseignant-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './enseignant-form.html',
  styleUrl: './enseignant-form.css'
})

export class EnseignantForm implements OnChanges {
  @Input() enseignant: Enseignant | null = null;
  @Output() save = new EventEmitter<Enseignant>();
  @Output() cancel = new EventEmitter<void>();

  formEnseignant: Enseignant = {
    departement: '',
    nomEnseignant: '',
    prenomEnseignant: '',
    specialite: '',
    emailEnseignant: ''
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['enseignant'] && this.enseignant) {
      this.formEnseignant = { ...this.enseignant };
    } else if (changes['enseignant'] && !this.enseignant) {
      this.formEnseignant = {
        departement: '',
        nomEnseignant: '',
        prenomEnseignant: '',
        specialite: '',
        emailEnseignant: ''
      };
    }
  }

  onSubmit() {
    this.save.emit(this.formEnseignant);
  }
}
