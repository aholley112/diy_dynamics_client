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
  { path: '', redirectTo: 'landing-page', pathMatch: 'full' },
  // Catch-all route to handle undefined routes, redirect to landing page or auth as preferred
  { path: '**', redirectTo: 'landing-page' }
];
