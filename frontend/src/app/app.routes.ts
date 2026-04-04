import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { Timetable } from './timetable/timetable';
import { AdminLogin } from './admin-login/admin-login';
import { EmploiTempsGestion } from './admin/emploi-temps-gestion/emploi-temps-gestion';
import { EnseignantComponent } from './admin/crud/enseignant/enseignant-component/enseignant-component';
import { Sidebar } from './sidebar/sidebar';
import { CoursComponent } from './admin/crud/cours/cours-component/cours-component';
import { SalleComponent } from './admin/crud/salle/salle-component/salle-component';
import { FiliereComponent } from './admin/crud/filiere/filiere-component/filiere-component';
import { Visualisation } from './admin/visualisation/visualisation';
import { FiliereCoursComponent } from './admin/crud/filiere-cours/filiere-cours-component/filiere-cours-component';
import { AuthGuard } from './guards/auth.guard';
import { Dashboard } from './admin/dashboard/dashboard';
import { Progression } from './admin/dashboard/progression/progression/progression';

export const routes: Routes = [
    { path: '', component: HomePage, data: { title: 'Accueil' } },
    { path: 'edt/:id', component: Timetable, data: { title: 'Emploi du Temps' } },
    { path: 'admin-login', component: AdminLogin, data: { title: 'Connexion Admin' } },
    {
        path: '',
        component: Sidebar,
        canActivateChild: [AuthGuard],
        children: [
            { path: 'admin/crud/cours', component: CoursComponent, data: { title: 'Gestion des Cours' } },
            { path: 'admin/crud/enseignants', component: EnseignantComponent, data: { title: 'Gestion des Enseignants' } },
            { path: 'admin/crud/salles', component: SalleComponent, data: { title: 'Gestion des Salles' } },
            { path: 'admin/crud/filieres', component: FiliereComponent, data: { title: 'Gestion des Filières' } },
            { path: 'admin/crud/filiere-cours', component: FiliereCoursComponent, data: { title: 'Filière & Cours' } },
            { path: 'admin/plannings', component: Visualisation, data: { title: 'Visualisation Plannings' } },
            { path: 'admin/g-edt', component: EmploiTempsGestion, data: { title: 'Gestion Emploi du Temps' } },
            { path: 'admin/dashboard', component: Dashboard, data: { title: 'Tableau de Bord' } },
            { path: 'admin/progression', component: Progression, data: { title: 'Progression Filière' } },
        ]
    }
];
