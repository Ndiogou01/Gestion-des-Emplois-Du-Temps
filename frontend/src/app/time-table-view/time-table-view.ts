import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlanningHebdomadaireService } from '../admin/planning-hebdomadaire/planningHebdomadaireService/planning-hebdomadaire-service';
import { CreneauService, Creneau } from '../admin/creneau-form/creneauService/creneau-service';
import { CoursService, Cours } from '../admin/crud/cours/cours';
import { EnseignantService, Enseignant } from '../admin/crud/enseignant/enseignant';
import { SalleService, Salle } from '../admin/crud/salle/salle';
import { Filiere, FiliereService } from '../admin/crud/filiere/filiere';

@Component({
  selector: 'app-time-table-view',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './time-table-view.html',
  styleUrls: ['./time-table-view.css']
})
export class TimeTableView implements OnInit {
  @Input() filiereId!: number;

  selectedPlanningId: number | null = null;
  creneaux: Creneau[] = [];
  coursList: Cours[] = [];
  filieres: Filiere [] = [];
  enseignantsList: Enseignant[] = [];
  sallesList: Salle[] = [];

  jours: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  heures: string[] = [
    '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
    '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00',
    '16:00 - 17:00', '17:00 - 18:00', '18:00 - 19:00', '19:00 - 20:00'
  ];

  filterCours: string = '';
  filterEnseignant: string = '';
  filterSalle: string = '';
  filterJour: string = '';

  currentFiliereName: string = '';
  selectedSemestre: string = '';
  dateDebut: string | Date = '';
  dateFin: string | Date = '';

  constructor(
    private planningService: PlanningHebdomadaireService,
    private creneauService: CreneauService,
    private coursService: CoursService,
    private enseignantService: EnseignantService,
    private salleService: SalleService,
    private filiereService: FiliereService
  ) {}

  ngOnInit(): void {
    if (this.filiereId) {
      this.filiereService.getAll().subscribe({
        next: (data) => {
          this.filieres = data;
      
          this.planningService.getPlanningActifByFiliere(this.filiereId).subscribe({
            next: (planning) => {
              if (planning && planning.id !== undefined) {
                this.selectedPlanningId = planning.id;
                this.currentFiliereName = this.getFiliereNom(planning.filiereId) || '';
                this.selectedSemestre = planning.semestre || '';
                this.dateDebut = planning.dateDebut;
                this.dateFin = planning.dateFin;
      
                this.creneauService.getAll().subscribe({
                  next: (data) => {
                    this.creneaux = data.filter(c => c.planningHebdomadaireId === this.selectedPlanningId);
                  },
                  error: (err) => console.error('Erreur creneaux:', err)
                });
              }
            }
          });
        },
        error: (err) => console.error('Erreur filières:', err)
      });
    }

    this.coursService.getAll().subscribe({
      next: (data) => { this.coursList = data; },
      error: (err) => console.error('Erreur cours:', err)
    });

    this.enseignantService.getAll().subscribe({
      next: (data) => { this.enseignantsList = data; },
      error: (err) => console.error('Erreur enseignants:', err)
    });

    this.salleService.getAll().subscribe({
      next: (data) => { this.sallesList = data; },
      error: (err) => console.error('Erreur salles:', err)
    });
  }

  get formattedDateRange(): string {
    if (this.dateDebut && this.dateFin) {
      const debut = new Date(this.dateDebut).toLocaleDateString('fr-FR');
      const fin = new Date(this.dateFin).toLocaleDateString('fr-FR');
      return `${debut} au ${fin}`;
    }
    return '';
  }
  
  getSelectedFiliereName(): string {
    return this.currentFiliereName || '';
  }

  shouldDisplayStart(creneau: Creneau, heure: string, jour: string): boolean {
    if (!creneau?.date || !creneau?.heureDebut) return false;
    const jourIndex = new Date(creneau.date).getDay();
    const joursFR = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const jourNom = joursFR[jourIndex - 1];
    const heureDebut = creneau.heureDebut.substring(0, 5);
    return jourNom?.toLowerCase() === jour.toLowerCase() && heureDebut === heure;
  }

  getCoursNom(id: number): string {
    return this.coursList.find(c => c.id === id)?.nomCours ?? 'Cours';
  }

  getFiliereNom(id: number): string {
    return this.filieres.find(c => c.id === id)?.nomFiliere ?? 'Filiere';
  }

  getEnseignantNom(id: number): string {
    const enseignant = this.enseignantsList.find(e => e.id === id);
    return enseignant ? `${enseignant.prenomEnseignant} ${enseignant.nomEnseignant}` : 'Enseignant';
  }

  getSalleNom(id: number): string {
    return this.sallesList.find(s => s.id === id)?.nomSalle ?? 'Salle';
  }

  getTypeCours(id: number): string {
    return this.coursList.find(c => c.id === id)?.typeDeCours || 'CM';
  }

  get creneauxFiltres(): Creneau[] {
    return this.creneaux
      .filter(c => c.planningHebdomadaireId === this.selectedPlanningId)
      .filter(c => !this.filterCours || this.getCoursNom(c.coursId).toLowerCase().includes(this.filterCours.toLowerCase()))
      .filter(c => !this.filterEnseignant || this.getEnseignantNom(c.enseignantId).toLowerCase().includes(this.filterEnseignant.toLowerCase()))
      .filter(c => !this.filterSalle || this.getSalleNom(c.salleId).toLowerCase().includes(this.filterSalle.toLowerCase()))
      .filter(c => !this.filterJour || this.jourCreneau(c).toLowerCase() === this.filterJour.toLowerCase());
  }

  jourCreneau(creneau: Creneau): string {
    if (!creneau?.date) return '';
    
    const joursFR = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    try {
      const date = new Date(creneau.date);
      // Ajustement pour que Dimanche=0, Lundi=1, etc. devienne Lundi=0, Mardi=1, etc.
      const jourIndex = date.getDay();
      // Si c'est dimanche (0), on retourne samedi (5) ou on gère selon votre logique
      return joursFR[jourIndex === 0 ? 5 : jourIndex - 1] || '';
    } catch (error) {
      console.error('Erreur conversion date:', error);
      return '';
    }
  }


  getHeightForCreneau(creneau: Creneau): number {
    const [hDeb, mDeb] = creneau.heureDebut.split(':').map(Number);
    const [hFin, mFin] = creneau.heureFin.split(':').map(Number);
    const diffMinutes = (hFin * 60 + mFin) - (hDeb * 60 + mDeb);
    return Math.max((diffMinutes / 60) * 80, 40);
  }

  async onExport(): Promise<void> {
    // Cacher la version mobile et montrer la version desktop pour l'export
    const mobileView = document.querySelector('.lg\\:hidden') as HTMLElement;
    const desktopView = document.querySelector('.hidden.lg\\:block') as HTMLElement;
    
    if (mobileView) mobileView.style.display = 'none';
    if (desktopView) desktopView.style.display = 'block';
  
    const el = document.querySelector('.space-y-6');
    if (!el) {
      console.error("Impossible de trouver le tableau à exporter");
      return;
    }
    
    // Le reste de votre code d'export existant...
    const filters = document.querySelector('.grid') as HTMLElement;
    if (filters) filters.style.display = 'none';
  
    const exportBtn = document.querySelector('#exportButton') as HTMLElement;
    if (exportBtn) exportBtn.style.display = 'none';
    
    const element = el as HTMLElement;
    const html2pdf = (await import('html2pdf.js')).default;
    
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'visible';
    
    const rect = element.getBoundingClientRect();
    const pdfWidth = rect.width;
    const pdfHeight = element.scrollHeight;
    
    const opt: any = {
      margin: [0.2, 0.2, 0.2, 0.2],
      filename: `emploi_du_temps_filiere_${this.filiereId}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        scrollY: 0,
        windowWidth: pdfWidth,
        windowHeight: pdfHeight,
        useCORS: true,
      },
      jsPDF: {
        unit: 'px',
        format: [pdfWidth + 40, pdfHeight + 40],
        orientation: 'landscape',
      },
    };
    
    try {
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
    } finally {
      // Restaurer l'affichage
      if (filters) filters.style.display = '';
      if (exportBtn) exportBtn.style.display = '';
      if (mobileView) mobileView.style.display = '';
      if (desktopView) desktopView.style.display = '';
      document.body.style.overflow = originalOverflow;
    }
  }  

  resetFilters(): void {
    this.filterCours = '';
    this.filterEnseignant = '';
    this.filterSalle = '';
    this.filterJour = '';
  }
    // Ajoutez cette propriété pour la légende
  legendItems = [
    { class: 'bg-blue-200 border-blue-200', label: 'CM' },
    { class: 'bg-amber-200 border-amber-200', label: 'TD' },
    { class: 'bg-teal-200 border-teal-200', label: 'TP' },
    { class: 'bg-purple-200 border-purple-200', label: 'Examen' },
    { class: 'bg-rose-200 border-rose-200', label: 'Devoir' },
    { class: 'bg-gray-100 border-gray-200', label: 'Pause' }
  ];

  // Méthodes pour la version mobile
  getCoursForHour(jour: string, heure: string): any {
    if (heure === '13:00 - 14:00' || heure === '14:00 - 15:00') {
      return null; // C'est une pause déjeuner
    }

    const heureDebut = heure.split('-')[0].trim();
    const creneau = this.creneauxFiltres.find(c => {
      const creneauJour = this.jourCreneau(c);
      return creneauJour?.toLowerCase() === jour.toLowerCase() && 
            c.heureDebut.substring(0, 5) === heureDebut;
    });
    
    if (!creneau) return null;
    
    return {
      nom: this.getCoursNom(creneau.coursId),
      enseignant: this.getEnseignantNom(creneau.enseignantId),
      salle: this.getSalleNom(creneau.salleId),
      type: this.getTypeCours(creneau.coursId)
    };
  }

  getTypeForHour(jour: string, heure: string): string {
    if (heure === '13:00 - 14:00' || heure === '14:00 - 15:00') {
      return 'pause';
    }

    const heureDebut = heure.split('-')[0].trim();
    const creneau = this.creneauxFiltres.find(c => {
      const creneauJour = this.jourCreneau(c);
      return creneauJour?.toLowerCase() === jour.toLowerCase() && 
            c.heureDebut.substring(0, 5) === heureDebut;
    });
    
    return creneau ? this.getTypeCours(creneau.coursId) : '';
  }

  // Méthode utilitaire pour vérifier si un créneau existe pour une heure/jour donnée
  hasCoursForHour(jour: string, heure: string): boolean {
    return this.getCoursForHour(jour, heure) !== null;
  }
}

