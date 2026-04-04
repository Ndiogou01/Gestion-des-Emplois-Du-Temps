import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Filiere } from '../filiere';

@Component({
  selector: 'app-filiere-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './filiere-form.html',
  styleUrl: './filiere-form.css'
})
export class FiliereForm implements OnChanges {
  @Input() filiere: Filiere | null = null;
  @Output() save = new EventEmitter<Filiere>();
  @Output() cancel = new EventEmitter<void>();

  formFiliere: Filiere = { nomFiliere: '' };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filiere'] && this.filiere) {
      this.formFiliere = { ...this.filiere };
    } else if (changes['filiere'] && !this.filiere) {
      this.formFiliere = { nomFiliere: '' };
    }
  }

  onSubmit() {
    
    this.save.emit(this.formFiliere);
  }

}
