import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Filiere } from '../../filiere/filiere';
import { Cours } from '../../cours/cours';
import { FiliereCours } from '../filiere-cours';


@Component({
  selector: 'app-filiere-cours-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './filiere-cours-form.html',
  styleUrl: './filiere-cours-form.css'
})
export class FiliereCoursForm implements OnChanges {
  @Input() filiereCours: FiliereCours | null = null;
  @Input() filieres: Filiere[] = [];
  @Input() cours: Cours[] = [];

  @Output() save = new EventEmitter<FiliereCours>();
  @Output() cancel = new EventEmitter<void>();

  formFiliereCours: FiliereCours = { 
    id:0,
    filiereId: 0,
    coursId: 0,
    volumeHoraireTotal: 0,
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filiereCours'] && this.filiereCours) {
      this.formFiliereCours = { ...this.filiereCours };
    } else if (changes['filiereCours'] && !this.filiereCours) {
      this.formFiliereCours = { filiereId: 0, coursId: 0, volumeHoraireTotal: 0 };
    }
  }

  onSubmit() {
    this.save.emit(this.formFiliereCours);
  }

}
