import { Component, OnInit, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AuthService } from '../admin-login/admin-service/auth-service';
import { Userservice, User } from './userservice';

@Component({
  selector: 'app-sidebar',
  imports: [MatSidenavModule, RouterOutlet, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})

export class Sidebar implements OnInit {
  
  userName: string = 'Utilisateur';
  sidenavOpen = true;
  isMobile = false;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: Userservice,
    @Inject(PLATFORM_ID) private platformId: Object 
  ){}
  
  ngOnInit() {
    this.userService.getCurrentUser().subscribe({
      next: (user: User) => {
        this.userName = `${user.prenom} ${user.nom}`;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération de l’utilisateur', err);
      }
    });
    
    this.checkScreenSize();
  }
  
  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }
  
  private checkScreenSize() {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth < 1024;
      this.sidenavOpen = !this.isMobile;
    }
  }
  
  closeOnMobile() {
    if (this.isMobile) {
      this.sidenavOpen = false;
    }
  }  

  getInitials(): string {
    if (!this.userName) return '';
    const parts = this.userName.trim().split(' ');
    return parts.map(p => p[0]).slice(0, 2).join('').toUpperCase();
  }
  

  logout(){
    this.authService.logout();
    this.router.navigate(['/admin-login']);
  }

  goToEditProfile() {
    this.router.navigate(['admin/edit-profile'], { relativeTo: this.route});
  }

  goToDashboard() {
    this.router.navigate(['admin/dashboard'], { relativeTo: this.route});
  }
  
  goToGEDT() {
    this.router.navigate(['admin/g-edt'], { relativeTo: this.route });
  }

  goToEnseignants() {
    this.router.navigate(['admin/crud/enseignants'], { relativeTo: this.route });
  }
  
  goToCours() {
    this.router.navigate(['admin/crud/cours'], { relativeTo: this.route });
  }

  goToFiliere() {
    this.router.navigate(['admin/crud/filieres'], { relativeTo: this.route });
  }

  goToSalle() {
    this.router.navigate(['admin/crud/salles'], { relativeTo: this.route });
  }

  goToFiliereCours() {
    this.router.navigate(['admin/crud/filiere-cours'], { relativeTo: this.route});
  }

  goToPlanning() {
    this.router.navigate(['admin/plannings'], { relativeTo: this.route});
  }

  toggleSidenav() {
    this.sidenavOpen = !this.sidenavOpen;
  }
  
}
