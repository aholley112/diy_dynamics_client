import { Routes } from '@angular/router';
/*import { NoAuthGuard } from './no-auth.guard';
import { AuthGuard } from './auth.guard';*/

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.component').then(m => m.AuthComponent),
    /*canActivate: [NoAuthGuard]*/
  },
  {
    path: 'landing-page',
    loadComponent: () => import('./landing-page/landing-page.component').then(m => m.LandingPageComponent),
    /*canActivate: [AuthGuard] // Apply AuthGuard to protect the landing page route and ensure only authenticated users can access it*/
  },

  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
   // canActivate: [AuthGuard]
  },

  {
    path: 'projects',
    loadComponent: () => import('./projects/projects.component').then(m => m.ProjectsComponent),
  },

  {
    path: 'categories',
    loadComponent: () => import('./categories/categories.component').then(m => m.CategoriesComponent),
  },

  { path: '', redirectTo: 'landing-page', pathMatch: 'full' },

  { path: '**', redirectTo: 'home' }

];
