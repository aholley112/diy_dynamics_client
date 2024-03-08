import { Routes } from '@angular/router';
// import { NoAuthGuard } from './core/guards/no-auth.guard';
// import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.component').then(m => m.AuthComponent),
    // canActivate: [NoAuthGuard]
  },

  {
    path: 'home',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
    // canActivate: [AuthGuard]
  },


  {
    path: 'categories',
    loadComponent: () => import('./categories/categories.component').then(m => m.CategoriesComponent),
  },

    {
      path: 'profile',
      loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent),
      // canActivate: [AuthGuard]
    },

 { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: '**', redirectTo: 'home' }


];
