import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Cours } from '../cours';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Enseignant } from '../../../models/enseignant.model';

@Component({
  selector: 'app-cours-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './cours-form.html',
  styleUrl: './cours-form.css'
})
export class CoursForm implements OnChanges {
  @Input() cours: Cours | null = null;
  @Input() enseignants: Enseignant[] = [];

  @Output() save = new EventEmitter<Cours>();
  @Output() cancel = new EventEmitter<void>();

  formCours: Cours = {
    id: 0,
    nomCours: '',
    typeDeCours: 'CM',
    enseignantResponsableId: 0
  };

  ngOnChanges(changes: SimpleChanges) {

    if (changes['enseignants']) {
      console.log('Enseignants reçus dans le formulaire :', this.enseignants);
    }

    if (changes['cours'] && this.cours) {
      this.formCours = { ...this.cours };
    } else if (changes['cours'] && !this.cours) {
      this.formCours = {
        nomCours: '',
        typeDeCours: 'CM',
        enseignantResponsableId: 0
      };
    }
  }

  onSubmit() {
    this.save.emit(this.formCours);
  }
}
