import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Salle } from '../salle';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-salle-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './salle-form.html',
  styleUrl: './salle-form.css'
})
export class SalleForm implements OnChanges {
  @Input() salle: Salle | null = null;
  @Output() save = new EventEmitter<Salle>();
  @Output() cancel = new EventEmitter<void>();

  formSalle: Salle = { nomSalle: '' };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['salle'] && this.salle) {
      this.formSalle = { ...this.salle };
    } else if (changes['salle'] && !this.salle) {
      this.formSalle = { nomSalle: '' };
    }
  }

  onSubmit() {
    
    this.save.emit(this.formSalle);
  }
}
